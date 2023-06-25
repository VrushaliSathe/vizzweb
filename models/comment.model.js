const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const CommentSchema = Schema(
  {
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "client"
    },
    // comment reference
    objectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    // comment sender reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    // type of comment like comment, reply etc.
    objectType: {
        type: String,
        required: true,
    },
    date: { 
        type: Date, 
        required: true 
    },
    comment: { 
        type: String 
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1, //1:active, 0:deactive
    },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

CommentSchema.plugin(paginate);
CommentSchema.plugin(aggregatePaginate);

let comment = mongoose.models.comment || mongoose.model("comment", CommentSchema);
module.exports = comment;