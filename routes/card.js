const { celebrate, Joi } = require('celebrate');
const cardRouter = require('express').Router(); // создали роутер
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

cardRouter.get('/cards', getCards);

cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/(^https?:\/\/)(www.)?[a-z0-9-]+\.[a-z]{2,9}[a-z0-9\-\\._~:\\/?#\\[\]@!$&'\\(\\)*\\+,;=]/),
  }),
}), createCard);

cardRouter.delete('/cards/:cardid', deleteCard);

cardRouter.put('/cards/:cardid/likes', celebrate({
  params: Joi.object().keys({
    cardid: Joi.string().required().length(24),
  }),
}), likeCard);

cardRouter.delete('/cards/:cardid/likes', celebrate({
  params: Joi.object().keys({
    cardid: Joi.string().required().length(24),
  }),
}), dislikeCard);

module.exports = cardRouter; // экспортировали роутер
