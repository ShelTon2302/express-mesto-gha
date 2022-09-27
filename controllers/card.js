const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const RequestError = require('../errors/request-error');
const AccessError = require('../errors/access-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body; // получим из объекта запроса имя и описание пользователя

  Card.create({ name, link, owner }) // создадим документ на основе пришедших данных
    .then((card) => res.send({ card }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  let cardOwner;
  Card.findOneAndRemove({ _id: req.params.cardid, owner: req.user._id })
    .orFail()
    .then((card) => {
      cardOwner = card.owner;
      res.send({ card });
    })
    .catch((err) => {
      if (cardOwner !== req.user._id) {
        throw new AccessError('Нарушение прав доступа');
      }
      if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardid,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((card) => res.send({ card }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardid,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((card) => res.send({ card }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
    })
    .catch(next);
};
