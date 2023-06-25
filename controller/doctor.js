const responser = require("../core/responser");
const logger = require("../core/logger");
const DoctorModel = require("../models/doctor.model");
const MongooseService = require("../services/mongoose");

const action = {};
 
action.addDoctor = async (event, callback) => {
  logger.data("Add doctor called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const doctor = await MongooseService.save(DoctorModel, body );
    logger.data("doctor data", doctor);

    if (!doctor) {
      return responser.failure({
        handler: "doctor",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "doctor",
      messageCode: "S001",
      data: doctor
    });
  } catch (err) {
    logger.data("Failed to add doctor", err);
    return responser.catchResponse({
      handler: "doctor",
      messageCode: "E001",
      error: err
    });
  }  
};

action.updateDoctor = async (event, callback) => {
  logger.data("Update doctor called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const condition={
      filter:{
        _id: body.id
      }
    }
    const doctor = await MongooseService.update(DoctorModel, condition, body );
    logger.data("doctor data", doctor);

    if (!doctor) {
      return responser.failure({
        handler: "doctor",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "doctor",
      messageCode: "S001",
      data: doctor
    });
  } catch (err) {
    logger.data("Failed to add doctor", err);
    return responser.catchResponse({
      handler: "doctor",
      messageCode: "E001",
      error: err
    });
  }  
};

action.deleteDoctor = async (event, callback) => {
  logger.data("Delete doctor called");
  try {
    const { client } = event;
    const { id } = event.queryStringParameters;
    let condition = {
        filter: { _id: id },
        option: {}
    }
    const doctor = await MongooseService.delete(DoctorModel, condition );
    logger.data("doctor data", doctor);

    return responser.success({
      handler: "doctor",
      messageCode: "S004",
      data: doctor
    });
  } catch (err) {
    logger.data("Failed to deleting doctor", err);
    return responser.catchResponse({
      handler: "doctor",
      messageCode: "E004",
      error: err
    });
  }  
};

action.getDoctors = async (event, callback) => {
  logger.data("Get doctors called");
  try {
    const { client } = event;
    console.log("event.queryStringParameters",event);
    const page =event.queryStringParameters?.page || 1
    const limit = event.queryStringParameters?.limit || 10 ;
    const condition = {
      filter: {},
      option: {}
    };
    condition.filter = { client };
    // if(userType == "user") {
    //     condition.filter = { user };
    // }
    let result = undefined;
    condition.option = {
            populate: [
                {
                    path: "client",
                },
                // {
                //     path: "user",
                // }
            ],
            page: page,
            limit: limit
        };

    if(event.queryStringParameters?.id){
      result = await MongooseService.findOne(DoctorModel, condition );
    } else {
      result = await MongooseService.paginate(DoctorModel, condition );
      logger.data("doctor data", result);
    } 

    return responser.success({
      handler: "doctor",
      messageCode: "S004",
      data: result
    });
  } catch (err) {
    logger.data("Failed to fetching doctor list", err);
    return responser.catchResponse({
      handler: "doctor",
      messageCode: "E004",
      error: err
    });
  }  
};

module.exports = action;