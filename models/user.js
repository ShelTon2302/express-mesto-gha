const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Необходимо заполнить имя пользователя'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [true, 'Необходимо заполнить описание пользователя'],
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, 'Необходимо заполнить ссылку на аватар пользователя'],
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
