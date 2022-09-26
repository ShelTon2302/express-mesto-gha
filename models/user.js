const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const validator = require('validator');
const AuthError = require('../errors/auth-error');
const RequestError = require('../errors/request-error');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, 'Адрес email не уникален'],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      //  required: [true, 'Необходимо заполнить имя пользователя'],
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      //  required: [true, 'Необходимо заполнить описание пользователя'],
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      //  required: [true, 'Необходимо заполнить ссылку на аватар пользователя'],
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  {
    toObject: {
      useProjection: true,
      versionKey: false,
    },
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }

          return user; // теперь user доступен
        });
    });
};

userSchema.statics.validationEmail = function (email, password) {
  if (!validator.isEmail(email)) {
    throw new RequestError('Неверный формат почты');
  }
  return bcrypt.hash(password, 10);
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
