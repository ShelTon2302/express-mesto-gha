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
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardid)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        const deletedCard = card;
        card.remove()
          .catch(next);
        res.send(deletedCard);
      } else {
        next(new AccessError('Нарушение прав доступа'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
        return;
      }
      next(err);
    });
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
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
        return;
      }
      next(err);
    });
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
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
        return;
      }
      next(err);
    });
};
