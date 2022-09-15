const express = require('express');
const mongoose = require('mongoose');
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

app.use(express.json())
app.use('/', userRouter);

app.listen(PORT);
