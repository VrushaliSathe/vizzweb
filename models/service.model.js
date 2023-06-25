var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ServiceSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: "client",
        required: true,
    },
    name: String,
    slug: String,
    price: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    status: { type: Number, enum: [0, 1], required: true, default: 1 }, //0=deleted, 1=active
},
    {
        timestamps: true
    });

ServiceSchema.plugin(paginate);
ServiceSchema.plugin(aggregatePaginate);

module.exports = mongoose.models.client || mongoose.model("service", ServiceSchema);
