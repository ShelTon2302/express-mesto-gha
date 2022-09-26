const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const auth = require('./middlewares/auth');
const cardRouter = require('./routes/card');
const userRouter = require('./routes/user');
const { login, createUser } = require('./controllers/user');
const NotFoundError = require('./errors/not-found-error');

//  Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//  Подключаем базу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.post('/signin', login);

app.post('/signup', createUser);

app.use(auth);

app.use('/', userRouter, (req, res, next) => {
  next();
});

app.use('/', cardRouter, (req, res, next) => {
  next();
});

app.use('/', (req, res, next) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

app.listen(PORT);
