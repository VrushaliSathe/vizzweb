let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
require("../models/client.model");

let timeSlotSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "client",
    required: true,
  },
  slots: [{ String }],
  status: { type: Number, required: true, default: 1 }, //0=deleted, 1=active
  createdBy: String,
  modifiedBy: String,
},
{
  timestamps: true
});

timeSlotSchema.plugin(paginate);
timeSlotSchema.plugin(aggregatePaginate);

module.exports = mongoose.models.doctor || mongoose.model("time_slot", timeSlotSchema);