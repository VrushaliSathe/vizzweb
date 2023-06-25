const responser = require("../core/responser");
const logger = require("../core/logger");
const UserModel = require("../models/user.model");
const UserService = require("../services/user");
const Bcrypt = require("bcryptjs");

const action = {};
 
action.profile = async (event, callback) => {
  logger.data("User profile called");
  try {
    const populate = [
      {
        path: 'type',
        select: 'name slug'
      },
      {
        path: 'client',
        select: 'name slug'
      }];
    const user = await MongooseService.findOne(UserModel, { filter: { _id: event.userId } }, populate, {password:0});
    logger.data("user data", user);

    if (!user) {
      return responser.failure({
        handler: "auth",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "user",
      messageCode: "S001",
      data: user
    });
  } catch (err) {
    logger.data("Failed to login", err);
    return responser.catchResponse({
      handler: "user",
      messageCode: "E001",
      error: err
    });
  }  
};

action.addUser = async (event, callback) => {
  logger.data("Add user called");
  try {
    const { client, userId } = event;
    let body = JSON.parse(event.body);

    body.password = Bcrypt.hashSync(process.env.DEFAULT_PASS, 10);
    body.createdBy = userId;
    body.modifiedBy = userId;
    body.client = client;
    body.resetPassword = true;

    logger.data("user inserting data", body);

    const query = {};
    query.filter = { phone: body.phone, client };
    let findUser = await UserService.findOne(query);
    logger.data("user find", findUser);

    if(findUser) {
      if(findUser.status == 1){
        return responser.success({
          handler: "user",
          messageCode: "S006"
        });
      }
      const enableUser = await UserService.update(query, { ...body, setUpRequired: false, companySetupDone: true, status: 1 });

      // Send message to user 


      return responser.success({
        handler: "user",
        messageCode: "S001",
        data: enableUser
      })
    }

    const user = await UserService.save(body);

    // Send message to user

    logger.data("user inserted data", user);
    if (!user) {
      return responser.failure({
        handler: "user",
        messageCode: "E001",
      });
    }

    return responser.success({
      handler: "user",
      messageCode: "S001",
      data: user
    });
  } catch (err) {
    logger.data("Failed to add user", err);
    return responser.catchResponse({
      handler: "user",
      messageCode: "E001",
      error: err
    });
  }  
};

action.updateUser = async (event, callback) => {
  logger.info("Update user called");
  try {
    const { client, userId } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    body.id = body.id ?? userId;
    const condition={
      filter:{
        _id: body.id
      }
    }

    logger.data("body data", body);

    const userData = await UserService.update(condition, body );
    logger.data("user data", userData);

    if (!userData) {
      return responser.failure({
        handler: "user",
        messageCode: "E002",
      });
    }

    return responser.success({
      handler: "user",
      messageCode: "S002",
      data: userData
    });
  } catch (err) {
    logger.data("Failed to add user", err);
    return responser.catchResponse({
      handler: "user",
      messageCode: "E002",
      error: err
    });
  }  
};

action.deleteUser = async (event, callback) => {
  logger.data("Delete user called");
  try {
    const { client } = event;
    const { id } = event.queryStringParameters;
    let condition = {
        filter: { _id: id },
        option: {}
    }
    const userData = await UserService.delete( condition );
    logger.data("user data", userData);

    return responser.success({
      handler: "user",
      messageCode: "S003",
      data: userData
    });
  } catch (err) {
    logger.data("Failed to deleting user", err);
    return responser.catchResponse({
      handler: "user",
      messageCode: "E003",
      error: err
    });
  }  
};

action.getUsers = async (event, callback) => {
  logger.data("Get Users called");
  try {
    const { client } = event;
    const page =event.queryStringParameters?.page || 1
    const limit = event.queryStringParameters?.limit || 10 ;
    const condition = {
      filter: {
        client
      },
      option: {}
    };
    // if(userType == "user") {
    //     condition.filter = { user };
    // }
    let result = undefined;
    condition.option = {
            populate: [
                {
                    path: "client",
                    select: "name slug"
                },
                {
                  path: "type",
                  select: "name slug"
              } 
            ],
            page: page,
            limit: limit
        };

    if(event.queryStringParameters?.id){
      condition.filter = {_id: event.queryStringParameters?.id}
      result = await UserService.findOne(condition);
    } else {
      result = await UserService.paginate( condition );
      logger.data("user data", result);
    } 

    return responser.success({
      handler: "user",
      messageCode: "S004",
      data: result
    });
  } catch (err) {
    logger.data("Failed to fetching user list", err);
    return responser.catchResponse({
      handler: "user",
      messageCode: "E004",
      error: err
    });
  }  
};

module.exports = action;