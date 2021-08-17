const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    userid: String,
    status: String
  });

  const Status = mongoose.model('Status', statusSchema);
  module.exports = Status