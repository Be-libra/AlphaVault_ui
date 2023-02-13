const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transaction = new Schema(
  {
   transaction_hash : {type : String},
   fromAddress : {type : String},
   toAddress : {type : String},
   amount : {type : Number},
   timestamp : {type : Number}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("transaction", transaction);