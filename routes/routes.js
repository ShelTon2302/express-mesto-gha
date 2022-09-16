const router = require('express').Router(); // создали роутер
const { getAllUser, getUser, createUser, updateUser, updateAvatar } = require('./user');
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('./card');

router.get('/users', getAllUser);

router.get('/users/:id', getUser);

router.post('/users', createUser);

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:cardid', deleteCard);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

router.put('/cards/:cardid/likes', likeCard);

router.delete('/cards/:cardid/likes', dislikeCard);

module.exports = router; // экспортировали роутер