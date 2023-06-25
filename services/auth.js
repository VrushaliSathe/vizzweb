const logger = require("../core/logger");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Bcrypt = require("bcryptjs");

const action = {};

action.register = async (payload) => {
  try {
      payload.password = Bcrypt.hashSync(payload?.password, 10);
      let newString = payload.name
      .trim()
      .replace(/[!@#$%^&?/<>()*]/g, "")
      .split(" ")
      .join("-")
      .toLowerCase();
      logger.data("user payload", payload);
      payload.slug = newString;
      const userToSave = await UserModel.create(payload);
      const token = jwt.sign(
        {
          expiresIn: "15m",
          id: userToSave._id,
          type: userToSave.type,
          // email: userToSave.email,
          phone: userToSave.phone,
        },
        process.env.JWT_SECRET
      );
    const user = await UserModel.findById(userToSave._id).populate("client")
    return { token, user }
  } catch (err) {
     return err;
  } 
};

action.login = async (body) => {
  try {
    return await UserModel.findOne({$or: [{email: body.username }, {phone: body.username }] }).populate(
      [
        {
          path: 'type',
          select: 'name slug'
        },
        {
          path: 'client',
          select: 'name slug logo bannerImage website currency language phone email timeZone'
        }]
    );
  } catch (err) {
     return err;
  } 
};

module.exports = action;