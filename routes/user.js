const userRouter = require('express').Router(); // создали роутер
const {
  getAllUser, getUser, currentUser, updateUser, updateAvatar,
} = require('../controllers/user');

userRouter.get('/users', getAllUser);

userRouter.get('/users/me', currentUser);

userRouter.get('/users/:id', getUser);

userRouter.patch('/users/me', updateUser);

userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter; // экспортировали роутер
