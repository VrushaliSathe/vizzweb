const responser = require("../core/responser")

module.exports.init = async (event, context, callback) => {
    const responseDataObject = {
        callback: callback,
        event: event,
        handler: "hello",
        messageCode: "S001",
      };
    return responser.success(responseDataObject)
};