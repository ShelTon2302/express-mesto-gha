const userRouter = require('express').Router(); // создали роутер
const { getAllUser, getUser, createUser, updateUser, updateAvatar } = require('../controllers/user');

userRouter.get('/users', getAllUser);

userRouter.get('/users/:id', getUser);

userRouter.post('/users', createUser);

userRouter.patch('/users/me', updateUser);

userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter; // экспортировали роутер