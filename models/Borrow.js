const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    user_id: String,
    umbrella_id: String,
    borrow_time: String,
    borrow_place: String,
    getting_time: String,
    getting_place: String,
    time: Number,
    status: String
  });

  const Borrow = mongoose.model('Borrow', borrowSchema);
  module.exports = Borrow