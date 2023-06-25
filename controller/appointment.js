const responser = require("../core/responser");
const logger = require("../core/logger");
const AppointmentModel = require("../models/appointment.model");
const AppointmentService = require("../services/appointment");

const action = {};
 
action.addAppointment = async (event, callback) => {
  logger.data("Add appointment called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const appointment = await AppointmentService.save(body );
    logger.data("appointment data", appointment);

    if (!appointment) {
      return responser.failure({
        handler: "appointment",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "appointment",
      messageCode: "S001",
      data: appointment
    });
  } catch (err) {
    logger.data("Failed to add appointment", err);
    return responser.catchResponse({
      handler: "appointment",
      messageCode: "E001",
      error: err
    });
  }  
};

action.updateAppointment = async (event, callback) => {
  logger.data("Update appointment called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const condition={
      filter:{
        _id: body.id
      }
    }
    const appointment = await AppointmentService.update(condition, body );
    logger.data("appointment data", appointment);

    if (!appointment) {
      return responser.failure({
        handler: "appointment",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "appointment",
      messageCode: "S001",
      data: appointment
    });
  } catch (err) {
    logger.data("Failed to add appointment", err);
    return responser.catchResponse({
      handler: "appointment",
      messageCode: "E001",
      error: err
    });
  }  
};

action.deleteAppointment = async (event, callback) => {
  logger.data("Delete appointment called");
  try {
    const { client } = event;
    const { id } = event.queryStringParameters;
    let condition = {
        filter: { _id: id },
        option: {}
    }
    const appointment = await AppointmentService.delete(condition );
    logger.data("appointment data", appointment);

    return responser.success({
      handler: "appointment",
      messageCode: "S004",
      data: appointment
    });
  } catch (err) {
    logger.data("Failed to deleting appointment", err);
    return responser.catchResponse({
      handler: "appointment",
      messageCode: "E004",
      error: err
    });
  }  
};

action.getAppointments = async (event, callback) => {
  logger.data("Get appointments called");
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
      result = await AppointmentService.findOne(condition );
    } else {
      result = await AppointmentService.paginate(condition );
      logger.data("appointment data", result);
    } 

    return responser.success({
      handler: "appointment",
      messageCode: "S004",
      data: result
    });
  } catch (err) {
    logger.data("Failed to fetching appointment list", err);
    return responser.catchResponse({
      handler: "appointment",
      messageCode: "E004",
      error: err
    });
  }  
};

module.exports = action;