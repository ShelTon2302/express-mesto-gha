const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const auth = require('./middlewares/auth');
const cardRouter = require('./routes/card');
const userRouter = require('./routes/user');
const { ERROR_NOTFOUND } = require('./utils/error');

//  Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser());

//  Подключаем базу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use('/', userRouter, (req, res, next) => {
  next();
});

app.use(auth);

app.use('/', cardRouter, (req, res, next) => {
  next();
});

app.use('/', (req, res) => {
  res.status(ERROR_NOTFOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
