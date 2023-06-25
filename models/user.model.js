var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
require("../models/client.model");
require("../models/doctor.model")
require("../models/identifier.model")
require("../models/user-type.model")
require("../models/branch.model")
require("../models/address.model")

const UserDetail = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "client",
  },
  name: String,
  email: String,
  photo: String,
  language: String,
  dob: Date,
  password: { type: String, required: true },
  phone: { type: String},
  type: {
    type: Schema.Types.ObjectId,
    ref: "user_type"
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "branch",
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: "address",
  },
  resetPassword: { type: Boolean, default: false },
  createdBy: String,
  modifiedBy: String,
  status: { type: String, required: true, default: 1 },
},{
  timestamps: true
});

UserDetail.plugin(paginate);
UserDetail.plugin(aggregatePaginate);

module.exports = mongoose.models.user || mongoose.model("user", UserDetail);