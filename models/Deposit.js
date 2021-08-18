const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    user_id: String,
    locker: String,
    deposit_time: String,
    deposit_place: String,
    return_time: String,
    return_place: String,
    time: Number,
    status: String
  });

  const Deposit = mongoose.model('Deposit', depositSchema);
  module.exports = Deposit