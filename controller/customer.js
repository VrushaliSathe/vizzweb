const responser = require("../core/responser");
const logger = require("../core/logger");
const CustomerService = require("../services/customer");

const action = {};
 
action.addCustomer = async (event, callback) => {
  logger.data("Add customer called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const customer = await CustomerService.save( body );
    logger.data("customer data", customer);

    if (!customer) {
      return responser.failure({
        handler: "customer",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "customer",
      messageCode: "S001",
      data: customer
    });
  } catch (err) {
    logger.data("Failed to add customer", err);
    return responser.catchResponse({
      handler: "customer",
      messageCode: "E001",
      error: err
    });
  }  
};

action.updateCustomer = async (event, callback) => {
  logger.data("Update customer called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const condition={
      filter:{
        _id: body.id
      }
    }
    const customer = await CustomerService.update( condition, body );
    logger.data("customer data", customer);

    if (!customer) {
      return responser.failure({
        handler: "customer",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "customer",
      messageCode: "S001",
      data: customer
    });
  } catch (err) {
    logger.data("Failed to add customer", err);
    return responser.catchResponse({
      handler: "customer",
      messageCode: "E001",
      error: err
    });
  }  
};

action.deleteCustomer = async (event, callback) => {
  logger.data("Delete customer called");
  try {
    const { client } = event;
    const { id } = event.queryStringParameters;
    let condition = {
        filter: { _id: id },
        option: {}
    }
    const customer = await CustomerService.delete( condition );
    logger.data("customer data", customer);

    return responser.success({
      handler: "customer",
      messageCode: "S004",
      data: customer
    });
  } catch (err) {
    logger.data("Failed to deleting customer", err);
    return responser.catchResponse({
      handler: "customer",
      messageCode: "E004",
      error: err
    });
  }  
};

action.getCustomers = async (event, callback) => {
  logger.data("Get customers called");
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
      result = await CustomerService.findOne( condition );
    } else {
      result = await CustomerService.paginate( condition );
      logger.data("customer data", result);
    } 

    return responser.success({
      handler: "customer",
      messageCode: "S004",
      data: result
    });
  } catch (err) {
    logger.data("Failed to fetching customer list", err);
    return responser.catchResponse({
      handler: "customer",
      messageCode: "E004",
      error: err
    });
  }  
};

module.exports = action;