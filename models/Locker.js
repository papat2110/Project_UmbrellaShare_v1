const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema({
    node_ip: String,
    locker1: String,
    locker2: String,
    locker3: String,
    locker4: String,
    locker5: String,
    locker6: String,
    locker7: String,
    locker8: String
  });

  const Locker = mongoose.model('Locker', lockerSchema);
  module.exports = Locker