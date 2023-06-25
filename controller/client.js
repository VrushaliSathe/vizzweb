const responser = require("../core/responser");
const logger = require("../core/logger");
const ClientService = require("../services/client");

const action = {};
 
action.addClient = async (event, callback) => {
  logger.data("Add client called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const clientData = await ClientService.save( body );
    logger.data("client data", clientData);

    if (!client) {
      return responser.failure({
        handler: "client",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "client",
      messageCode: "S001",
      data: client
    });
  } catch (err) {
    logger.data("Failed to add client", err);
    return responser.catchResponse({
      handler: "client",
      messageCode: "E001",
      error: err
    });
  }  
};

action.updateClient = async (event, callback) => {
  logger.info("Update client called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const condition={
      filter:{
        _id: client
      }
    }
    const clientData = await ClientService.update( condition, body );
    console.log("client data", clientData);
    logger.data("client data", clientData);

    if (!client) {
      return responser.failure({
        handler: "client",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "client",
      messageCode: "S002",
      data: client
    });
  } catch (err) {
    logger.data("Failed to add client", err);
    return responser.catchResponse({
      handler: "client",
      messageCode: "E001",
      error: err
    });
  }  
};

action.deleteClient = async (event, callback) => {
  logger.data("Delete client called");
  try {
    const { client } = event;
    const { id } = event.queryStringParameters;
    let condition = {
        filter: { _id: id },
        option: {}
    }
    const clientData = await ClientService.delete( condition );
    logger.data("client data", clientData);

    return responser.success({
      handler: "client",
      messageCode: "S003",
      data: client
    });
  } catch (err) {
    logger.data("Failed to deleting client", err);
    return responser.catchResponse({
      handler: "client",
      messageCode: "E003",
      error: err
    });
  }  
};

action.getCompanies = async (event, callback) => {S
  logger.data("Get companies called");
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
      result = await ClientService.findOne( condition );
    } else {
      result = await ClientService.paginate( condition );
      logger.data("client data", result);
    } 

    return responser.success({
      handler: "client",
      messageCode: "S004",
      data: result
    });
  } catch (err) {
    logger.data("Failed to fetching client list", err);
    return responser.catchResponse({
      handler: "client",
      messageCode: "E004",
      error: err
    });
  }  
};

module.exports = action;