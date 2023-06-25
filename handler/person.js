const responser = require('../core/responser');
const { addPerson, getPersons, updatePerson, deletePerson } = require("../controller/person");
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
            case event.path === '/person' && event.httpMethod == "POST":
                return await addPerson(event, cb);
            case event.path === '/person' && event.httpMethod == "PUT":
                return await updatePerson(event, cb);
            case event.path === '/person' && event.httpMethod == "DELETE":
                return await deletePerson(event, cb);
            case event.path === '/person' && event.httpMethod == "GET":
                return await getPersons(event, cb);
          }
    }
  } catch (error) {
    console.log(error);
    const responseDataObject = {
        callback: cb,
        err: error,
        event: event,
        handler: "person",
        messageCode: "E007",
      };
    return responser.failure(responseDataObject);
  } finally {
    await coreDB.closeDBConnection(db);
  }
};