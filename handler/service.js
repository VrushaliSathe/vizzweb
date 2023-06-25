const responser = require('../core/responser');
const { addService, deleteService,getServices, updateService } = require("../controller/service");
const authorizer = require("../auth/authorizer");

const coreDB = require("../core/db");

module.exports.init = async (event, context, cb) => {
  console.log("START: init",event.path, event.httpMethod)
  const db = await coreDB.openDBConnection();
  console.log("START: init")
  try {
    const auth = await authorizer.verify(event, cb);
    if(auth){
        switch (true) {
            case event.path === '/service' && event.httpMethod == "POST":
                return await addService(event, cb);
            case event.path === '/service' && event.httpMethod == "PUT":
                return await updateService(event, cb);
            case event.path === '/service' && event.httpMethod == "DELETE":
                return await deleteService(event, cb);
            case event.path === '/service' && event.httpMethod == "GET":
                return await getServices(event, cb);
          }
    }
  } catch (error) {
    console.log(error);
    const responseDataObject = {
        callback: cb,
        err: error,
        event: event,
        handler: "service",
        messageCode: "E007",
      };
    return responser.failure(responseDataObject);
  } finally {
    await coreDB.closeDBConnection(db);
  }
};