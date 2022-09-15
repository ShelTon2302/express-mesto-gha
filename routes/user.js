const router = require('express').Router(); // создали роутер
const User = require('../models/user');

router.get('/users', (req, res) => {
  User.find({})
    .then(users => res.send({ users: users }))
    .catch(err => res.status(500).send({ message: 'Ошибка загрузки списка пользователей' }));
});

router.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Ошибка загрузки пользователя' }));
});

router.post('/users', (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя и описание пользователя

  User.create({ name, about, avatar }) // создадим документ на основе пришедших данных
    .then(user => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send({ message: 'Ошибка создания пользователя'}));
});

module.exports = router; // экспортировали роутер