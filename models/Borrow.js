const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    user_id: String,
    umbrella_id: String,
    borrow_time: Number,
    borrow_place: String,
    getting_time: Number,
    getting_place: String,
    time: Number,
    status: String
  });

  const Borrow = mongoose.model('Borrow', borrowSchema);
  module.exports = Borrow