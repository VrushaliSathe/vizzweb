var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const IdentifierSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    provider: { type: String },
    providerUID: { type: String },
    email: { type: String },
    emailVerified: { type: Boolean },
    authToken: { type: String },
    socialAccountDetail: Object,
    userAgent: Object
  },{
    timestamps: true
  });
  
  IdentifierSchema.plugin(paginate);
  IdentifierSchema.plugin(aggregatePaginate);
  
  module.exports = mongoose.models.identifier || mongoose.model("identifier", IdentifierSchema);