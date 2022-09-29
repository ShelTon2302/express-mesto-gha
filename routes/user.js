const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router(); // создали роутер
const {
  getAllUser, getUser, currentUser, updateUser, updateAvatar,
} = require('../controllers/user');
const { urlRule } = require('../const/const');

userRouter.get('/users', getAllUser);

userRouter.get('/users/me', currentUser);

userRouter.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), getUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRule),
  }),
}), updateAvatar);

module.exports = userRouter; // экспортировали роутер
