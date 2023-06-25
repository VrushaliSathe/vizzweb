const responser = require("../core/responser");
const logger = require("../core/logger");
const TimeSlotService = require("../services/time-slot");

const action = {};
 
action.addTimeSlot = async (event, callback) => {
  logger.data("Add timeslot called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const timeslot = await TimeSlotService.save( body );
    logger.data("timeslot data", timeslot);

    if (!timeslot) {
      return responser.failure({
        handler: "timeslot",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "timeslot",
      messageCode: "S001",
      data: timeslot
    });
  } catch (err) {
    logger.data("Failed to add timeslot", err);
    return responser.catchResponse({
      handler: "timeslot",
      messageCode: "E001",
      error: err
    });
  }  
};

action.updateTimeSlot = async (event, callback) => {
  logger.data("Update timeslot called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const condition={
      filter:{
        _id: body.id
      }
    }
    const timeslot = await TimeSlotService.update( condition, body );
    logger.data("timeslot data", timeslot);

    if (!timeslot) {
      return responser.failure({
        handler: "timeslot",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "timeslot",
      messageCode: "S001",
      data: timeslot
    });
  } catch (err) {
    logger.data("Failed to add timeslot", err);
    return responser.catchResponse({
      handler: "timeslot",
      messageCode: "E001",
      error: err
    });
  }  
};

action.deleteTimeSlot = async (event, callback) => {
  logger.data("Delete timeslot called");
  try {
    const { client } = event;
    const { id } = event.queryStringParameters;
    let condition = {
        filter: { _id: id },
        option: {}
    }
    const timeslot = await TimeSlotService.delete( condition );
    logger.data("timeslot data", timeslot);

    return responser.success({
      handler: "timeslot",
      messageCode: "S004",
      data: timeslot
    });
  } catch (err) {
    logger.data("Failed to deleting timeslot", err);
    return responser.catchResponse({
      handler: "timeslot",
      messageCode: "E004",
      error: err
    });
  }  
};

action.getTimeSlots = async (event, callback) => {
  logger.data("Get TimeSlots called");
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
      result = await TimeSlotService.findOne( condition );
    } else {
      result = await TimeSlotService.paginate( condition );
      logger.data("timeslot data", result);
    } 

    return responser.success({
      handler: "timeslot",
      messageCode: "S004",
      data: result
    });
  } catch (err) {
    logger.data("Failed to fetching timeslot list", err);
    return responser.catchResponse({
      handler: "timeslot",
      messageCode: "E004",
      error: err
    });
  }  
};

module.exports = action;