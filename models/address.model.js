var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const AddressSchema = new Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "client"
    },
    fullAddress: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zip: Number,
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

AddressSchema.plugin(paginate);
AddressSchema.plugin(aggregatePaginate);

module.exports = mongoose.models.address || mongoose.model("address", AddressSchema);