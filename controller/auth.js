const responser = require("../core/responser");
const logger = require("../core/logger");
const UserModel = require("../models/user.model");
const ClientModel = require("../models/client.model");
const TempSignupModel = require("../models/tempSignup.model");
const UserTypeModel = require("../models/user-type.model");
const AuthService = require("../services/auth");
// const email = require("../services/email");
const MongooseService = require("../services/mongoose");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const awsSdk = require("aws-sdk");
const mongoose = require("mongoose");

awsSdk.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.DEFAULT_REGION,
});

const sns = new awsSdk.SNS();

const action = {};
 
action.login = async (event, callback) => {
  logger.data("Login called");
  try {
    const body = JSON.parse(event.body);
    logger.data("body", body);
    const user = await AuthService.login(body);
    logger.data("user data", user);

    if (!user) {
      return responser.failure({
        handler: "auth",
        messageCode: "E006",
      });
    }

    if (!Bcrypt.compareSync(body.password, user.password)) {
      return responser.failure({
        handler: "auth",
        messageCode: "E005",
      });
    }
    const token = jwt.sign(
      {
          expiresIn: "15m",
          id: user._id,
          client: user.client._id,
          type: user.type._id,
          email: user.email,
          username: user.username,
          phone: user.phone,
      },
      process.env.JWT_SECRET
    );
    return responser.success({
      handler: "auth",
      messageCode: "S002",
      data: { accessToken: token, refreshToken: token, user }
    });
  } catch (err) {
    logger.data("Failed to login", err);
    return responser.catchResponse({
      handler: "auth",
      messageCode: "E003",
      error: err
    });
  }  
};

action.register = async (event, callback) => {
  logger.data("START: Register");
  try {
    console.log("Req",event);
    const body = JSON.parse(event.body);
    logger.data("body", body);
    const clientId = mongoose.Types.ObjectId();
    const userId = mongoose.Types.ObjectId();
    const query = {};
    let $or = []; 
    const tempUser = await MongooseService.findOne(TempSignupModel, {filter: { phone: body.phone }});
    if(tempUser && !tempUser.verified) return responser.failure({
      handler: "auth",
      messageCode: "E011"
    });

    if(body.phone) $or.push({
      phone: body.phone
    });

    query.filter = { 
      $or: $or
    };
    
    logger.data("query", query);

    let org = await MongooseService.findOne(ClientModel, query);

    logger.data("org data", org);
    // if(org?.email) {
    //   return responser.failure({
    //     handler: "auth",
    //     messageCode: "E003",
    //     error: { email: org.email }
    //   });
    // }

    if(org?.phone){
      return responser.failure({
        handler: "auth",
        messageCode: "E003",
        error: { phone: org.phone }
      });
    } 

    if(!org){
      const insertOrg = {
        _id: clientId,
        name: body.name,
        phone: body.phone,
        // email: body.email,
        createdBy: userId,
        modifiedBy: userId,
        startDate: Date.now(),
        agreementAccepted: body.agreementAccepted
      };
      logger.data("org inserting data", insertOrg);
      const newString = insertOrg.name
        .trim()
        .replace(/[!@#$%^&?/<>()*]/g, "")
        .split(" ")
        .join("-")
        .toLowerCase();
      insertOrg.slug = newString;
      const org = await MongooseService.save(ClientModel, insertOrg);

      logger.data("org inserted data", org);

      let user = await MongooseService.findOne(UserModel, query);

      logger.data("user data", user);

      if (!user) {
        const insertUserType = {
          name: "OWNER",
          createdBy: userId,
          modifiedBy: userId,
          client: clientId
        };
        const typeSlug = insertUserType.name
          .trim()
          .replace(/[!@#$%^&?/<>()*]/g, "")
          .split(" ")
          .join("-")
          .toLowerCase();
        insertUserType.slug = typeSlug;

        const userType = await UserTypeModel.create(insertUserType);

        const insertUser = {
          _id: userId,
          type: userType,
          name: body.name,
          password: body.password,
          phone: body.phone,
          email: body.email,
          agreementAccepted: body.agreementAccepted,
          client: clientId
        };

        logger.data("user inserting data", insertUser);

        const data = await AuthService.register(insertUser);

        logger.data("user inserted data", data);

        await TempSignupModel.findOneAndUpdate({phone: body.phone }, { verified: true });
        return responser.success({
          handler: "auth",
          messageCode: "S003"
        });
      } else {
        return responser.failure({
          handler: "auth",
          messageCode: "E004",
          error: { phone: user.phone }
        });
      }
    } else return responser.failure({
      handler: "auth",
      messageCode: "E004",
      error: { phone: user.phone }
    });   
  } catch (err) {
    logger.error("REGISTER FAILED", err);
    return responser.catchResponse({
      handler: "auth",
      messageCode: "E001",
    });
  }  
};

action.verifyOtp = async (event, callback) => {
  logger.data("START: Verify OTP");
  try {
    console.log("Req",event);
    const body = JSON.parse(event.body);
    logger.data("body", body);
    // const clientId = mongoose.Types.ObjectId();
    // const userId = mongoose.Types.ObjectId();
    const tempUser = await MongooseService.findOne(TempSignupModel, { filter : { phone: body.phone, otp: body.otp }});
    logger.data("Temp user",tempUser);
    if(!tempUser) return responser.failure({
      handler: "auth",
      messageCode: "E006",
    });
    await TempSignupModel.findOneAndUpdate({phone: tempUser.phone }, { verified: true });
    action.register({body: JSON.stringify(tempUser)})
    return responser.success({
      handler: "auth",
      messageCode: "S005"
    });
  } catch (err) {
    logger.error("REGISTER FAILED", err);
    return responser.catchResponse({
      handler: "auth",
      messageCode: "E001",
      error: err
    });
  }  
};

action.sendOtp = async (event, callback) => {
  logger.info("sendOtp called");
  try {
    logger.info("Start : Send otp api");
    const body = JSON.parse(event.body);
    let tempUser = await MongooseService.findOne(TempSignupModel, { filter: { phone: body.phone }});

    if(tempUser) return responser.failure({
      handler: "auth",
      messageCode: "E004",
      error: { phone: tempUser.phone }
    });

    if (process.env.CURRENT_ENV === "dev" || process.env.CURRENT_ENV === "stage") body.otp = 1234;
    else {
      body.otp = Math.floor(1000 + Math.random() * 9000);
    }
    const insertTempUser = {
      name: body.name,
      password: body.password,
      otp: body.otp,
      phone: body.phone,
      agreementAccepted: body.agreementAccepted,
    };
    const saveTempUser = await MongooseService.save(TempSignupModel, insertTempUser);

    event.body['otp'] = saveTempUser?.otp;
    // await action.sendOtp(event, callback);
    logger.data("Temp user data", saveTempUser);
    // if (process.env.CURRENT_ENV === "dev" || process.env.CURRENT_ENV === "stage") body.otp = 1234;
    // else {
    //   const otp = Math.floor(1000 + Math.random() * 9000);
    //   body.otp = otp;
    //   const data = messageTemplate(body);
    //   logger.data("SMS template => ", data);
    //   const sendSMS = await sns
    //     .publish({
    //       Message: data.message,
    //       Subject: "Admin",
    //       PhoneNumber: data.phone,
    //     })
    //     .promise();
    //   logger.data("SMS sent successfully..", sendSMS);

    // const saveOtp = await this.saveOtp(body.otp, body.phone);
    // logger.data("OTP =>", saveOtp);
    // }
    // await action.saveOtp(body)
    return responser.success({
      handler: "auth",
      messageCode: "S004"
    });
  } catch (error) {
    return responser.catchResponse({
      handler: "auth",
      messageCode: "E001",
    });
  }
};

action.saveOtp = async ({otp, phone}) => {
  try {
    const queryFilter = { phone };
    const updateData = {
      otp: otp,
    };
    const otpUpdated = await TempSignupModel.findOneAndUpdate(queryFilter, updateData, { upsert: true, new: true });
    return otpUpdated;
  } catch (error) {
    logger.data("Save otp error", error);
    throw error;
  }
};


const messageTemplate = (data) => {
  return {
    phoneNumber: data.mobileNumber,
    message: `${process.env.ESPORTS_PLATFORM_URL}: Your OTP is ${data.otp}. Please don't share this OTP to anyone.`,
    OTP: data.otp,
  };
};
action.doCompleteRegistration = async (req, res) => {
  logger.data("req.params.verificationKey", req.params.verificationKey);
  if (!req.params.verificationKey) {
    let data = {
      success: false,
      message: "Wrong URL, Please contact us.",
    };
    return responser.failure({
      handler: "auth",
      messageCode: "E008"
    });
  }
  try {
    const query = queryBuilder.build();
    query.filter._id = ObjectId(req.params.verificationKey);
    logger.data("query", query);
    let findUser = await auth.findUser(query.filter);
    logger.data("findUser", findUser);

    if (findUser && findUser.verified == "Y") {
      let data = {
        success: false,
        message: "URL already Verified. Please Login",
      };
      logger.data("data", data);
      res.redirect(`${process.env.PLATFORM}login?emailVerificationStatus=alreadyVerified`);
    } else if (findUser && findUser.verified == "N") {
      _verifyUser(findUser, req, res);
    }
  } catch (error) {
    logger.data("error", error);
    let data = {
      success: false,
      message: "Something wrong while getting user, Please contact us.",
    };
    return responser.failure({
      handler: "auth",
      messageCode: "E009"
    });
  }
};

/**
 * Email verification and complete registration
 */
const _verifyUser = async (findUser, req, res) => {
  logger.data("Verify user called");
  try {
    findUser.verified = "Y";
    findUser.userStatus = "active";
    findUser.updatedAgent = req.useragent;
    const user = await userService.update({ _id: findUser._id }, findUser);
    logger.data("update user data", user);
    const updateClient = await clientService.update(
      { _id: user.clientId },
      { verified: "Y" }
    );
    logger.data("update client data", updateClient);

    logger.info("Email verified successfully, Please login.");

    let emailVerificationRes = {
      success: true,
      message: "Email verified successfully, Please login.",
    };
    logger.data("Data",emailVerificationRes);
    res.redirect(`${process.env.PLATFORM}login?emailVerificationStatus=true`);
    // res.status(200).send(emailVerificationRes);
  } catch (error) {
    logger.data("There is something wrong while verifying user", error);
    let data = {
      success: false,
      message: "There is something wrong while verifying user.",
      error: error,
    };
    return responser.failure({
      handler: "auth",
      messageCode: "E010"
    });
  }
};


module.exports = action;