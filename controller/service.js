const responser = require("../core/responser");
const logger = require("../core/logger");
const service = require("../services/service");

const action = {};

action.addService = async (event, callback) => {
  logger.data("Add service called");
  try {
    const { client, userId } = event;
    let body = JSON.parse(event.body);

    body.createdBy = userId;
    body.modifiedBy = userId;
    body.client = client;

    logger.data("service inserting data", body);

    const insertedService = await service.save(body);

    // Send message to service

    logger.data("service inserted data", insertedService);
    if (!insertedService) {
      return responser.failure({
        handler: "service",
        messageCode: "E001",
      });
    }

    return responser.success({
      handler: "service",
      messageCode: "S001",
      data: insertedService
    });
  } catch (err) {
    logger.data("Failed to add service", err);
    return responser.catchResponse({
      handler: "service",
      messageCode: "E001",
      error: err
    });
  }  
};

action.updateService = async (event, callback) => {
  logger.info("Update service called");
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

    const serviceData = await service.update(condition, body );
    logger.data("service data", serviceData);

    if (!serviceData) {
      return responser.failure({
        handler: "service",
        messageCode: "E002",
      });
    }

    return responser.success({
      handler: "service",
      messageCode: "S002",
      data: serviceData
    });
  } catch (err) {
    logger.data("Failed to add service", err);
    return responser.catchResponse({
      handler: "service",
      messageCode: "E002",
      error: err
    });
  }  
};

action.deleteService = async (event, callback) => {
  logger.data("Delete service called");
  try {
    const { client } = event;
    const { id } = event.queryStringParameters;
    let condition = {
        filter: { _id: id },
        option: {}
    }
    const serviceData = await service.delete( condition );
    logger.data("service data", serviceData);

    return responser.success({
      handler: "service",
      messageCode: "S003",
      data: serviceData
    });
  } catch (err) {
    logger.data("Failed to deleting service", err);
    return responser.catchResponse({
      handler: "service",
      messageCode: "E003",
      error: err
    });
  }  
};

action.getServices = async (event, callback) => {
  logger.data("Get Services called");
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
    // if(userType == "service") {
    //     condition.filter = { service };
    // }
    let result = undefined;
    condition.option = {
            populate: [
                {
                    path: "client",
                    select: "name slug"
                }
            ],
            page: page,
            limit: limit
        };

    if(event.queryStringParameters?.id){
      condition.filter = {_id: event.queryStringParameters?.id}
      result = await service.findOne(condition);
    } else {
      result = await service.paginate( condition );
      logger.data("service data", result);
    } 

    return responser.success({
      handler: "service",
      messageCode: "S004",
      data: result
    });
  } catch (err) {
    logger.data("Failed to fetching service list", err);
    return responser.catchResponse({
      handler: "service",
      messageCode: "E004",
      error: err
    });
  }  
};

module.exports = action;