const User = require('../models/user');
const { ERROR_CODE, ERROR_NOTFOUND, ERROR_DEFAULT } = require('../utils/error');

module.exports.getAllUser = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => {
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка загрузки списка пользователей' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'TypeError') {
        res.status(ERROR_NOTFOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка загрузки пользователя' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar }) // создадим документ на основе пришедших данных
    .then((user) => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(ERROR_NOTFOUND).send({ message: 'Ошибка создания пользователя' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body; // получим из объекта запроса имя и описание пользователя

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_NOTFOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка обновления данных пользователя' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_NOTFOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка обновления данных аватара' });
    });
};
