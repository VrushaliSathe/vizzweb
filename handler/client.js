const responser = require('../core/responser');
const { addClient, getCompanies, updateClient, deleteClient } = require("../controller/Client");
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
            case event.path === '/client' && event.httpMethod == "POST":
                return await addClient(event, cb);
            case event.path === '/client' && event.httpMethod == "PUT":
                return await updateClient(event, cb);
            case event.path === '/client' && event.httpMethod == "DELETE":
                return await deleteClient(event, cb);
            case event.path === '/client' && event.httpMethod == "GET":
                return await getCompanies(event, cb);
          }
    }
  } catch (error) {
    console.log(error);
    const responseDataObject = {
        callback: cb,
        err: error,
        event: event,
        handler: "client",
        messageCode: "E007",
      };
    return responser.failure(responseDataObject);
  } finally {
    await coreDB.closeDBConnection(db);
  }
};