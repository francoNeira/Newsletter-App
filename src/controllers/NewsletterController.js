const fs = require('fs');
const Newsletter = require('../services/Newsletter');
const BadRequest = require('../exceptions/api/BadRequest');
const NotFoundError = require('../exceptions/service/NotFoundError');
const RelatedResourceNotFound = require('../exceptions/api/relatedResourceNotFound');

class NewsletterController {
  getNewsletter(filename = 'data.json') {
    return fs.existsSync(filename)
      ? Newsletter.load(filename)
      : new Newsletter();
  }

  saveNewsletter(newsletter, filename = 'data.json') {
    newsletter.save(filename);
  }

  async subscribe(req, res, next) {
    let { artistId, email } = req.body;
    let parsedId = parseInt(artistId);
    if (parsedId && email) {
      try {
        let newsletter = this.getNewsletter();
        await newsletter.validateId(parsedId);
        await newsletter.addSubscription(parsedId, email);
        this.saveNewsletter(newsletter);
        res.status(200).send();
      } catch (error) {
        if (error instanceof NotFoundError) next(new RelatedResourceNotFound());
        else next(error);
      }
    } else next(new BadRequest());
  }

  async unsubscribe(req, res, next) {
    let { artistId, email } = req.body;
    let parsedId = parseInt(artistId);
    if (parsedId && email) {
      try {
        let newsletter = this.getNewsletter();
        await newsletter.validateId(parsedId);
        await newsletter.removeSubscription(parsedId, email);
        this.saveNewsletter(newsletter);
        res.status(200).send();
      } catch (error) {
        if (error instanceof NotFoundError) next(new RelatedResourceNotFound());
        else next(error);
      }
    } else next(new BadRequest());
  }

  async notify(req, res, next) {
    let { artistId, subject, message } = req.body;
    let parsedId = parseInt(artistId);
    if (parsedId && subject && message) {
      try {
        let newsletter = this.getNewsletter();
        await newsletter.validateId(parsedId);
        await newsletter.notify(parsedId, subject, message);
        res.status(200).send();
      } catch (error) {
        if (error instanceof NotFoundError) next(new RelatedResourceNotFound());
        else next(error);
      }
    } else next(new BadRequest());
  }

  async getSubscriptions(req, res, next) {
    let { artistId } = req.query;
    let parsedId = parseInt(artistId);
    if (parsedId) {
      try {
        let newsletter = this.getNewsletter();
        await newsletter.validateId(parsedId);
        let subscriptors = await newsletter.getSubscriptors(parsedId);
        let response = {
          artistId: parsedId,
          subscriptors,
        };
        res.status(200).json(response);
      } catch (error) {
        if (error instanceof NotFoundError) next(new RelatedResourceNotFound());
        else next(error);
      }
    } else next(new BadRequest());
  }

  async deleteSubscriptions(req, res, next) {
    let { artistId } = req.body.data;
    let parsedId = parseInt(artistId);
    if (parsedId) {
      try {
        let newsletter = this.getNewsletter();
        await newsletter.validateId(parsedId);
        await newsletter.deleteSubscriptions(parsedId);
        this.saveNewsletter(newsletter);
        res.status(200).send();
      } catch (error) {
        if (error instanceof NotFoundError) next(new RelatedResourceNotFound());
        else next(error);
      }
    } else next(new BadRequest());
  }

  async ping(_req, res, next) {
    try {
      res.status(200).send('pong');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NewsletterController;
