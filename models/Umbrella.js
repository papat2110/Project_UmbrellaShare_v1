const mongoose = require('mongoose');

const umbrellaSchema = new mongoose.Schema({
    rfid: String,
    status: String,
    place: String,
    user: String,
    noti_sst: String,
    photo: String
  });

  const Umbrella = mongoose.model('Umbrella', umbrellaSchema);
  module.exports = Umbrella