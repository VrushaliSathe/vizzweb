const responser = require('../core/responser');
const { addDoctor, getDoctors, updateDoctor, deleteDoctor } = require("../controller/doctor");
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
            case event.path === '/doctor' && event.httpMethod == "POST":
                return await addDoctor(event, cb);
            case event.path === '/doctor' && event.httpMethod == "PUT":
                return await updateDoctor(event, cb);
            case event.path === '/doctor' && event.httpMethod == "DELETE":
                return await deleteDoctor(event, cb);
            case event.path === '/doctor' && event.httpMethod == "GET":
                return await getDoctors(event, cb);
          }
    }
  } catch (error) {
    console.log(error);
    const responseDataObject = {
        callback: cb,
        err: error,
        event: event,
        handler: "doctor",
        messageCode: "E007",
      };
    return responser.failure(responseDataObject);
  } finally {
    await coreDB.closeDBConnection(db);
  }
};