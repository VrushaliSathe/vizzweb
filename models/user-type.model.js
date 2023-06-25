var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const UserTypeSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "client",
    required: true,
  },
  name: String,
  slug:String,
  createdBy: { type: String },
  modifiedBy: { type: String },
  status: { type: Number, enum: [0, 1], required: true, default: 1 }, //0=deleted, 1=active
},
{
  timestamps: true
});

UserTypeSchema.plugin(paginate);
UserTypeSchema.plugin(aggregatePaginate);

module.exports = mongoose.models.user_type || mongoose.model("user_type", UserTypeSchema);
