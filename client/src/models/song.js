export default class Song {
  constructor ({
    trackName, name,
    artistName, artist,
    collectionName, album,
    imgURL,
    previewUrl, songURL,
    trackId,
    _id } = {}) {
    this.name = trackName || name
    this.artist = artistName || artist
    this.album = collectionName || album
    this.imgURL = imgURL
    this.songURL = previewUrl || songURL
    this.trackId = trackId
    this._id = _id
  }
}
