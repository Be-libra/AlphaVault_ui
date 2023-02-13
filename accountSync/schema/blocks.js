const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const block = new Schema(
  {
   block_hash : {type : String},
   parent_hash : {type : String},
   timestamp : {type : Number},
   process : {type : Number, default :1}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("block", block);