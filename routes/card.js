const cardRouter = require('express').Router(); // создали роутер
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/card');

cardRouter.get('/cards', getCards);

cardRouter.post('/cards', createCard);

cardRouter.delete('/cards/:cardid', deleteCard);

cardRouter.put('/cards/:cardid/likes', likeCard);

cardRouter.delete('/cards/:cardid/likes', dislikeCard);

module.exports = cardRouter; // экспортировали роутер