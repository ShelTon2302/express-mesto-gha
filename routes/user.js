const User = require('../models/user');

module.exports.getAllUser = (req, res) => {
  User.find({})
    .then(users => res.send({ users }))
    .catch(err => {
      res.status(500).send({ message: 'Ошибка загрузки списка пользователей' })});
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(500).send({ message: 'Ошибка загрузки пользователя' })});
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar }) // создадим документ на основе пришедших данных
    .then(user => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Ошибка создания пользователя' })});
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body; // получим из объекта запроса имя и описание пользователя

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then(user => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(500).send({ message: 'Ошибка обновления данных пользователя' })});
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(user => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(500).send({ message: 'Ошибка обновления данных аватара' })});

};