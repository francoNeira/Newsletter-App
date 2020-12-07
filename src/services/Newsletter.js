const fs = require('fs');
const picklify = require('picklify');
const axios = require('axios').default;
const GMailAPIClient = require('../clients/GMailAPIClient');
const Subscription = require('../model/Subscription');
const NotFoundError = require('../exceptions/service/NotFoundError');
const url = require('../../resources/unqfyConnection.json').url;

class Newsletter {
  constructor() {
    this._subscriptions = [];
    this._nextId = 0;
  }

  async validateId(artistId) {
    try {
      await axios.get(`${url}/${artistId}`);
    } catch (error) {
      if (
        error.response.data.status === 404 &&
        error.response.data.errorCode === 'RESOURCE_NOT_FOUND'
      )
        throw new NotFoundError(
          `No se ha encontrado un artista registrado con el id '${artistId}'.`
        );
      throw error;
    }
  }

  addSubscription(artistId, email) {
    if (!this._hasSubscription(artistId, email))
      this._subscriptions.push(
        new Subscription(this._getId(), artistId, email)
      );
  }

  removeSubscription(artistId, email) {
    if (this._hasSubscription(artistId, email)) {
      let index = this._subscriptions.findIndex(
        subscription =>
          subscription.hasArtistId(artistId) && subscription.hasEmail(email)
      );
      this._subscriptions.splice(index, 1);
    }
  }

  notify(artistId, subject, message) {
    if (this._hasSubscriptors(artistId))
      try {
        let subscriptors = this.getSubscriptors(artistId);
        let gmail = new GMailAPIClient();
        let receiver = { name: '' };
        let sender = { name: '', email: '' };
        subscriptors.forEach(subscriptor => {
          receiver.email = subscriptor;
          gmail.send_mail(subject, message, receiver, sender);
        });
      } catch (error) {
        throw error;
      }
  }

  getSubscriptors(artistId) {
    return this._hasSubscriptors(artistId)
      ? this._subscriptions
          .filter(subscription => subscription.hasArtistId(artistId))
          .map(subscription => subscription.email)
      : [];
  }

  deleteSubscriptions(artistId) {
    while (this._hasSubscriptors(artistId)) {
      let index = this._subscriptions.findIndex(subscription =>
        subscription.hasArtistId(artistId)
      );
      this._subscriptions.splice(index, 1);
    }
  }

  _hasSubscription(artistId, email) {
    return this._subscriptions.some(
      subscription =>
        subscription.hasArtistId(artistId) && subscription.hasEmail(email)
    );
  }

  _getId() {
    this._nextId++;
    return this._nextId;
  }

  _hasSubscriptors(artistId) {
    return this._subscriptions.some(subscription =>
      subscription.hasArtistId(artistId)
    );
  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
    const classes = [Newsletter, Subscription];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

module.exports = Newsletter;
