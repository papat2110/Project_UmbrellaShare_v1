const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    user_id: String,
    locker: String,
    deposit_time: Number,
    deposit_place: String,
    return_time: Number,
    return_place: String,
    time: Number,
    status: String
  });

  const Deposit = mongoose.model('Deposit', depositSchema);
  module.exports = Deposit