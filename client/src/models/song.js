export default class Song {
  constructor ({ trackName, artistName, collectionName, imgURL, previewUrl, trackId, _id }) {
    this.name = trackName
    this.artist = artistName
    this.album = collectionName
    this.imgURL = imgURL
    this.songURL = previewUrl
    this.trackId = trackId
    if (_id) {
      this._id = _id
    }
  }
}
