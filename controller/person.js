const responser = require("../core/responser");
const logger = require("../core/logger");
const PersonService = require("../services/person");

const action = {};
 
action.addPerson = async (event, callback) => {
  logger.data("Add person called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const person = await PersonService.save(personModel, body );
    logger.data("person data", person);

    if (!person) {
      return responser.failure({
        handler: "person",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "person",
      messageCode: "S001",
      data: person
    });
  } catch (err) {
    logger.data("Failed to add person", err);
    return responser.catchResponse({
      handler: "person",
      messageCode: "E001",
      error: err
    });
  }  
};

action.updatePerson = async (event, callback) => {
  logger.data("Update person called");
  try {
    const { client } = event;
    const body = JSON.parse(event.body);
    body.client = client;
    const condition={
      filter:{
        _id: body.id
      }
    }
    const person = await PersonService.update(personModel, condition, body );
    logger.data("person data", person);

    if (!person) {
      return responser.failure({
        handler: "person",
        messageCode: "E006",
      });
    }

    return responser.success({
      handler: "person",
      messageCode: "S001",
      data: person
    });
  } catch (err) {
    logger.data("Failed to add person", err);
    return responser.catchResponse({
      handler: "person",
      messageCode: "E001",
      error: err
    });
  }  
};

action.deletePerson = async (event, callback) => {
  logger.data("Delete person called");
  try {
    const { client } = event;
    const { id } = event.queryStringParameters;
    let condition = {
        filter: { _id: id },
        option: {}
    }
    const person = await PersonService.delete(personModel, condition );
    logger.data("person data", person);

    return responser.success({
      handler: "person",
      messageCode: "S004",
      data: person
    });
  } catch (err) {
    logger.data("Failed to deleting person", err);
    return responser.catchResponse({
      handler: "person",
      messageCode: "E004",
      error: err
    });
  }  
};

action.getPersons = async (event, callback) => {
  logger.data("Get persons called");
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
      result = await PersonService.findOne(personModel, condition );
    } else {
      result = await PersonService.paginate(personModel, condition );
      logger.data("person data", result);
    } 

    return responser.success({
      handler: "person",
      messageCode: "S004",
      data: result
    });
  } catch (err) {
    logger.data("Failed to fetching person list", err);
    return responser.catchResponse({
      handler: "person",
      messageCode: "E004",
      error: err
    });
  }  
};

module.exports = action;