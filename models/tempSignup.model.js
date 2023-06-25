var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const TempSignupSchema = new Schema({
    name: String,
    phone: String,
    password: String,
    verified: { type:Boolean, required: true, default: false },
    otp: String,
    requestorIPAddress: String,
    invitedBy: String,
    verifiedIPAddress: String, 
    agreementAccepted: { type:Boolean, required: true, default: false },
    status: { type: Number, enum: [0, 1], required: true, default: 1 }, //0=deleted, 1=active
},
    {
        timestamps: true
    });

TempSignupSchema.plugin(paginate);
TempSignupSchema.plugin(aggregatePaginate);

module.exports = mongoose.models.temp_signup || mongoose.model("temp_signup", TempSignupSchema);