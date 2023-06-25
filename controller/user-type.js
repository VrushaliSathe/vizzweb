const responser = require("../core/responser");
const logger = require("../core/logger");
const MongooseService = require("../services/mongoose");

const action = {};
 
action.addUserType = async (event, callback) => {
  logger.data("Add usertype called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const usertype = await MongooseService.save( body );
    logger.data("usertype data", usertype);

    if (!usertype) {
      return responser.failure({
        handler: "usertype",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "usertype",
      messageCode: "S001",
      data: usertype
    });
  } catch (err) {
    logger.data("Failed to add usertype", err);
    return responser.catchResponse({
      handler: "usertype",
      messageCode: "E001",
      error: err
    });
  }  
};

action.updateUserType = async (event, callback) => {
  logger.data("Update usertype called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const condition={
      filter:{
        _id: body.id
      }
    }
    const usertype = await MongooseService.update( condition, body );
    logger.data("usertype data", usertype);

    if (!usertype) {
      return responser.failure({
        handler: "usertype",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "usertype",
      messageCode: "S001",
      data: usertype
    });
  } catch (err) {
    logger.data("Failed to add usertype", err);
    return responser.catchResponse({
      handler: "usertype",
      messageCode: "E001",
      error: err
    });
  }  
};

action.deleteUserType = async (event, callback) => {
  logger.data("Delete usertype called");
  try {
    const { client } = event;
    const { id } = event.queryStringParameters;
    let condition = {
        filter: { _id: id },
        option: {}
    }
    const usertype = await MongooseService.delete( condition );
    logger.data("usertype data", usertype);

    return responser.success({
      handler: "usertype",
      messageCode: "S004",
      data: usertype
    });
  } catch (err) {
    logger.data("Failed to deleting usertype", err);
    return responser.catchResponse({
      handler: "usertype",
      messageCode: "E004",
      error: err
    });
  }  
};

action.getUserTypes = async (event, callback) => {
  logger.data("Get UserTypes called");
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
      result = await MongooseService.findOne( condition );
    } else {
      result = await MongooseService.paginate( condition );
      logger.data("usertype data", result);
    } 

    return responser.success({
      handler: "usertype",
      messageCode: "S004",
      data: result
    });
  } catch (err) {
    logger.data("Failed to fetching usertype list", err);
    return responser.catchResponse({
      handler: "usertype",
      messageCode: "E004",
      error: err
    });
  }  
};

module.exports = action;