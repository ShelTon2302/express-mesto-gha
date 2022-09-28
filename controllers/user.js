const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const RequestError = require('../errors/request-error');
const AuthError = require('../errors/auth-error');
const NotUniqueEmailError = require('../errors/not-unique-email-error');

module.exports.getAllUser = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
        return;
      }
      res.send(user.toObject());
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.currentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user.toObject()))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ token });
    })
    .catch(() => {
      throw new AuthError('Необходима авторизация');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    })) // создадим документ на основе пришедших данных
    .then((user) => res.send(user.toObject()))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.code === 11000) {
        next(new NotUniqueEmailError('Пользователь с таким email уже существует'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body; // получим из объекта запроса имя и описание пользователя

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
        return;
      }
      res.send(user.toObject());
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
        return;
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
        return;
      }
      res.send(user.toObject());
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
        return;
      }
      next(err);
    });
};
