const mongoose = require('mongoose');

const realtimeSchema = new mongoose.Schema({
    node_ip: String,
    umbrella_id: String,
  });

  const Realtime = mongoose.model('Realtime', realtimeSchema);
  module.exports = Realtime