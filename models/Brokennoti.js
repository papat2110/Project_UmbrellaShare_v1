const mongoose = require('mongoose');

const brokennotiSchema = new mongoose.Schema({
    rfid: String,
    broken: String,
    place: String,
    user: String,
    noti_sst: String
  });

  const Brokennoti = mongoose.model('Brokennoti', brokennotiSchema);
  module.exports = Brokennoti