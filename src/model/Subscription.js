class Subscription {
  constructor(id, artistId, email) {
    this._id = id;
    this._artistId = artistId;
    this._email = email;
  }

  get email() {
    return this._email;
  }

  hasArtistId(artistId) {
    return this._artistId === artistId;
  }

  hasEmail(email) {
    return this._email.toLowerCase() === email.toLowerCase();
  }
}

module.exports = Subscription;
