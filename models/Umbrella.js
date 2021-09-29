const mongoose = require('mongoose');

const umbrellaSchema = new mongoose.Schema({
    rfid: String,
    status: String,
    place: String,
    user: String
  });

  const Umbrella = mongoose.model('Umbrella', umbrellaSchema);
  module.exports = Umbrella