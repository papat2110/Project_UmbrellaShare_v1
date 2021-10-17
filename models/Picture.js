const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
    user_id: String,
    borrow_id: String,
    borrow_pic: String,
    getting_pic: String
  });

  const Picture = mongoose.model('Picture', pictureSchema);
  module.exports = Picture