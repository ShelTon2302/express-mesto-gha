const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');

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
app.use('/', router);

app.listen(PORT);
