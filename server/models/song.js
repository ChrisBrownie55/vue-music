const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: true
  },
  imgURL: {
    type: String,
    required: true
  },
  songURL: {
    type: String,
    required: true
  },
  trackId: {
    type: Number,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Song', schema);
