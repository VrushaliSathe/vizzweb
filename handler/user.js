const responser = require('../core/responser');
const { profile, addUser, updateUser, deleteUser, getUsers } = require("../controller/user");
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
            case event.path === '/user/profile':
              return await profile(event, cb);
            case event.path === '/user' && event.httpMethod == "POST":
              return await addUser(event, cb);
            case event.path === '/user' && event.httpMethod == "PUT":
                return await updateUser(event, cb);
            case event.path === '/user' && event.httpMethod == "DELETE":
                return await deleteUser(event, cb);
            case event.path === '/user' && event.httpMethod == "GET":
                return await getUsers(event, cb);
          }
    }
  } catch (error) {
    console.log(error);
    const responseDataObject = {
        callback: cb,
        err: error,
        event: event,
        handler: "auth",
        messageCode: "E007",
      };
    return responser.failure(responseDataObject);
  } finally {
    await coreDB.closeDBConnection(db);
  }
};