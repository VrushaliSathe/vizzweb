const responser = require('../core/responser');
const { addTimeSlot, getTimeSlots, updateTimeSlot, deleteTimeSlot } = require("../controller/time-slot");
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
            case event.path === '/time-slot' && event.httpMethod == "POST":
                return await addTimeSlot(event, cb);
            case event.path === '/time-slot' && event.httpMethod == "PUT":
                return await updateTimeSlot(event, cb);
            case event.path === '/time-slot' && event.httpMethod == "DELETE":
                return await deleteTimeSlot(event, cb);
            case event.path === '/time-slot' && event.httpMethod == "GET":
                return await getTimeSlots(event, cb);
          }
    }
  } catch (error) {
    console.log(error);
    const responseDataObject = {
        callback: cb,
        err: error,
        event: event,
        handler: "timeslot",
        messageCode: "E007",
      };
    return responser.failure(responseDataObject);
  } finally {
    await coreDB.closeDBConnection(db);
  }
};