const mongoose = require('mongoose');

const doorSchema = new mongoose.Schema({
    serialNumber: String,
    status: String
  });

  const Door = mongoose.model('Door', doorSchema);
  module.exports = Door
