const logger = require("../core/logger");
const jwt = require("jsonwebtoken");
const coreDB = require("../core/db");
const responser = require("../core/responser");
const { getMessage } = require("../core/translate");
const UserModel = require("../models/user.model");

module.exports.verify = async (event, callback) => {
  const db = await coreDB.openDBConnection();
  // logger.data("Authorizer event ", event);
  const bearerHeader = event.headers?.Authorization || event.headers?.authorization;
  // logger.data("bearer token", bearerHeader);
  try {
    if (!bearerHeader) throw new Error("Authorization header not Found");
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    // logger.data("token", bearerToken);
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    if (decoded) {
      // logger.data("decoded", decoded);
      const user = await UserModel.findById(
        decoded.id,
        {
          password: 0
        }
      ).populate("client");
      if (!user) throw new Error("User Does Not Exist");
      logger.data("user", user);
      event.client = user.client;
      event.type = user.type;
      event.userId = user._id;
      event.user = user;
      return true
    }
  } catch (error) {
    logger.error("Authentication Failed", error);
    return responser.catchResponse({
      handler: "auth",
      messageCode: "E007",
      error
    });
  } finally {
    await coreDB.closeDBConnection(db);
  }
};
