const express = require('express');
const newsletter = express.Router();
const NewsletterController = require('../controllers/NewsletterController');

const controller = new NewsletterController();

newsletter.route('/subscribe').post((req, res, next) => {
  controller.subscribe(req, res, next);
});
newsletter.route('/unsubscribe').post((req, res, next) => {
  controller.unsubscribe(req, res, next);
});
newsletter.route('/notify').post((req, res, next) => {
  controller.notify(req, res, next);
});
newsletter
  .route('/subscriptions')
  .get((req, res, next) => {
    controller.getSubscriptions(req, res, next);
  })
  .delete((req, res, next) => {
    controller.deleteSubscriptions(req, res, next);
  });

module.exports = newsletter;
