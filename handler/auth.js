const responser = require('../core/responser');
const { login, register, verifyOtp, sendOtp } = require("../controller/auth");

const coreDB = require("../core/db");

module.exports.init = async (event, context, cb) => {
  console.log("START: init",event.path, event.httpMethod)
  const db = await coreDB.openDBConnection();
  console.log("START: init")
  try {
    switch (true) {
      case event.path === '/auth/register':
        return await register(event, cb);
      case event.path === '/auth/login':
        return await login(event, cb);
      case event.path === '/auth/verify-otp':
        return await verifyOtp(event, cb);
      case event.path === '/auth/send-otp':
        return await sendOtp(event, cb);
    }
  } catch (error) {
    console.log(error);
    const responseDataObject = {
        callback: cb,
        err: error,
        event: event,
        handler: "auth",
        messageCode: "S001",
      };
    return responser.failure(responseDataObject);
  } finally {
    await coreDB.closeDBConnection(db);
  }
};