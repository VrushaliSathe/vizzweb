const responser = require('../core/responser');
const { addCustomer, getCustomers, updateCustomer, deleteCustomer } = require("../controller/customer");
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
            case event.path === '/customer' && event.httpMethod == "POST":
                return await addCustomer(event, cb);
            case event.path === '/customer' && event.httpMethod == "PUT":
                return await updateCustomer(event, cb);
            case event.path === '/customer' && event.httpMethod == "DELETE":
                return await deleteCustomer(event, cb);
            case event.path === '/customer' && event.httpMethod == "GET":
                return await getCustomers(event, cb);
          }
    }
  } catch (error) {
    console.log(error);
    const responseDataObject = {
        callback: cb,
        err: error,
        event: event,
        handler: "customer",
        messageCode: "E007",
      };
    return responser.failure(responseDataObject);
  } finally {
    await coreDB.closeDBConnection(db);
  }
};