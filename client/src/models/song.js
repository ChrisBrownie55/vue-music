export default class Song {
  constructor ({ name, artist, album, imgURL, songURL, trackId, _id }) {
    this.name = name
    this.artist = artist
    this.album = album
    this.imgURL = imgURL
    this.songURL = songURL
    this.trackId = trackId
    this._id = _id
  }
}
