const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: [true, 'Адрес email не уникален'],
  },
  password: {
    type: String,
    required: true,
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
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

userSchema.statics.validationEmail = function (email) {
  return validator.isEmail(email);
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
