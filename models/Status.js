const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    userid: String,
    status: String,
    place: String
  });

  const Status = mongoose.model('Status', statusSchema);
  module.exports = Status