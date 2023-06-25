const responser = require('../core/responser');
const { addAppointment, getAppointment, updateAppointment, deleteAppointment } = require("../controller/appointment");
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
            case event.path === '/appointment' && event.httpMethod == "POST":
                return await addAppointment(event, cb);
            case event.path === '/appointment' && event.httpMethod == "PUT":
                return await updateAppointment(event, cb);
            case event.path === '/appointment' && event.httpMethod == "DELETE":
                return await deleteAppointment(event, cb);
            case event.path === '/appointment' && event.httpMethod == "GET":
                return await getAppointment(event, cb);
          }
    }
  } catch (error) {
    console.log(error);
    const responseDataObject = {
        callback: cb,
        err: error,
        event: event,
        handler: "appointment",
        messageCode: "E007",
      };
    return responser.failure(responseDataObject);
  } finally {
    await coreDB.closeDBConnection(db);
  }
};