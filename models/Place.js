const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    latitude: String,
    longitude: String,
    place: String,
    node_ip: String
  });

  const Place = mongoose.model('Place', placeSchema);
  module.exports = Place