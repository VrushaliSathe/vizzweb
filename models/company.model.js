var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const CompanySchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "client",
    required: true,
  },
  status: { type: Number, enum: [0, 1], required: true, default: 1 }, //0=deleted, 1=active
  createdBy: { type: String },
  modifiedBy: { type: String },
},
{
  timestamps: true
});

CompanySchema.plugin(paginate);
CompanySchema.plugin(aggregatePaginate);

module.exports = mongoose.models.client || mongoose.model("company", CompanySchema);
