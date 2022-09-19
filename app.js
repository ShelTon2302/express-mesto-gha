const express = require('express');
const mongoose = require('mongoose');
const cardRouter = require('./routes/card');
const userRouter = require('./routes/user');


// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

//Подключаем базу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  //useCreateIndex: true,
  //useFindAndModify: false
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63234ffacf2ccf2d9d528edf' // вставьте сюда _id созданного в предыдущем пункте пользователя
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
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
