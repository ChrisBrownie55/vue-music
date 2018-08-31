const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  playlistId: {
    type: Schema.Types.ObjectId,
    ref: 'Playlist',
    required: true
  },
  songId: {
    type: Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  }
});

module.exports = mongoose.model('PlaylistSong', schema);
