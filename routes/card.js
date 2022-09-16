const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ cards }))
    .catch(err => res.status(500).send({ message: 'Ошибка загрузки списка карточек' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body; // получим из объекта запроса имя и описание пользователя

  console.log({name, link, owner});

  Card.create({ name, link, owner }) // создадим документ на основе пришедших данных
    .then(card => res.send({ card }))
    // данные не записались, вернём ошибку
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Ошибка создания карточки' })});
};

module.exports.deleteCard = (req, res) => {

  Card.findByIdAndRemove(req.params.cardid)
    .then(card => res.send({ deletedcard: card }))
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(500).send({ message: 'Ошибка удаления карточки' })});
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardid,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true
    }
  )
    .orFail(() => console.log('error'))
    .then(card => res.send({ card }))
    // данные не записались, вернём ошибку
    .catch(err => {
      console.log(err.name);

      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(500).send({ message: 'Ошибка изменения свойства Like карточки' })});
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardid,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    {
      new: true,
      runValidators: true
     }
  )
    .then(card => res.send({ card }))
    // данные не записались, вернём ошибку
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(500).send({ message: 'Ошибка изменения свойства Like карточки' })});
};