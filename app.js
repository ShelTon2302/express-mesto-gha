const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const cardRouter = require('./routes/card');
const userRouter = require('./routes/user');
const { ERROR_NOTFOUND } = require('./utils/error');

//  Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
//  Подключаем базу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

console.log(validator.isEmail('foobar.com'));

app.use((req, res, next) => {
  req.user = {
    _id: '63234ffacf2ccf2d9d528edf', //  вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/', userRouter, (req, res, next) => {
  next();
});

app.use('/', cardRouter, (req, res, next) => {
  next();
});

app.use('/', (req, res) => {
  res.status(ERROR_NOTFOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
