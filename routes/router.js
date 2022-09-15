const router = require('express').Router(); // создали роутер
const User = require('../models/user');

router.get('/users', (req, res) => {
  console.log(res);
});

router.get('/users/:id', (req, res) => {
  console.log(res);
});

router.post('/users', (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя и описание пользователя

  User.create({ name, about, avatar }) // создадим документ на основе пришедших данных
    .then(user => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send(err.name));
});

module.exports = router; // экспортировали роутер