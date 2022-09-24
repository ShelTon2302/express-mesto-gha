const Card = require('../models/card');
const { ERROR_CODE, ERROR_NOTFOUND, ERROR_DEFAULT } = require('../utils/error');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Ошибка загрузки списка карточек' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body; // получим из объекта запроса имя и описание пользователя

  Card.create({ name, link, owner }) // создадим документ на основе пришедших данных
    .then((card) => res.send({ card }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка создания карточки' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndRemove({ _id: req.params.cardid, owner: req.user._id })
    .orFail()
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOTFOUND).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка удаления карточки' });
    });
};

module.exports.likeCard = (req, res) => {
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
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOTFOUND).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка изменения свойства Like карточки' });
    });
};

module.exports.dislikeCard = (req, res) => {
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
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOTFOUND).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка изменения свойства Like карточки' });
    });
};
