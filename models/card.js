const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Необходимо заполнить название карточки'],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, 'Необходимо заполнить ссылку на картинку карточки'],
    validate: {
      validator: (value) => validator.isURL(value, { protocols: ['http', 'https'] }),
      message: 'Введите корректный email',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
