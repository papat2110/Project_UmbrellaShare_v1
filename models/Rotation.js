const mongoose = require('mongoose');

const rotationSchema = new mongoose.Schema({
    nodeip: String,
    status: String
  });

  const Rotation = mongoose.model('Rotation', rotationSchema);
  module.exports = Rotation