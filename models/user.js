const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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

userSchema.statics.validationEmail = function (email) {
  return validator.isEmail(email);
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
