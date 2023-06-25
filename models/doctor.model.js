let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
require("../models/client.model");

let doctorSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "client",
    required: true,
  },
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: "user",
  //   required: true,
  // },
  fullName: { type: String, required: true },
  experience: { type: Number },
  address: { type: String },
  street: { type: String },
  city: { type: String },
  country: { type: String },
  pinCode: { type: String },
  fee: { type: Number },
  education: [String],
  expDetail: [String], //Experience
  awards: [String],
  expertise: [String], //Expertise
  orgName: { type: String }, //clinic or hospital name
  sortDesc: { type: String },
  longDesc: { type: String },
  phone: { type: String },
  email: { type: String },
  profilePhoto: { type: String },
  sxwInternal: { type: Boolean, default: false },
  status: { type: Number, required: true, default: 1 }, //0=deleted, 1=active
  createdBy: String,
  modifiedBy: String,
},
{
  timestamps: true
});

doctorSchema.plugin(paginate);
doctorSchema.plugin(aggregatePaginate);

module.exports = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);