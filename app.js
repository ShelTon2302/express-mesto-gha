const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/(^https?:\/\/)(www.)?[a-z0-9-]+\.[a-z]{2,9}[a-z0-9\-\\._~:\/?#\[\]@!$&'\(\)*\+,;=]/),
  }),
}), createUser);

app.use(auth);

app.use('/', userRouter, (req, res, next) => {
  next();
});

app.use('/', cardRouter, (req, res, next) => {
  next();
});

app.use('/', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  next();
});

app.listen(PORT);
