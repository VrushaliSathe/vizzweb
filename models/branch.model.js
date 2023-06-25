var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const BranchSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    slug: String,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "client"
    },
    website: String,
    language: String,
    timeZone: String,
    dateFormate: String,
    currency: String,
    clientLogo: String,
    bannerImage: String,
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address"
    },
    remark: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: { type: Number, enum: [0, 1], required: true, default: 1 }, //0=deleted, 1=active
},
    {
        timestamps: true
    });

BranchSchema.plugin(paginate);
BranchSchema.plugin(aggregatePaginate);

module.exports = mongoose.models.branch || mongoose.model("branch", BranchSchema);