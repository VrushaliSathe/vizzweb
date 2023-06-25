const responser = require('../core/responser');
const { addUserType, getUserTypes, updateUserType, deleteUserType } = require("../controller/user-type");
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
            case event.path === '/user-type' && event.httpMethod == "POST":
                return await addUserType(event, cb);
            case event.path === '/user-type' && event.httpMethod == "PUT":
                return await updateUserType(event, cb);
            case event.path === '/user-type' && event.httpMethod == "DELETE":
                return await deleteUserType(event, cb);
            case event.path === '/user-type' && event.httpMethod == "GET":
                return await getUserTypes(event, cb);
          }
    }
  } catch (error) {
    console.log(error);
    const responseDataObject = {
        callback: cb,
        err: error,
        event: event,
        handler: "usertype",
        messageCode: "E007",
      };
    return responser.failure(responseDataObject);
  } finally {
    await coreDB.closeDBConnection(db);
  }
};