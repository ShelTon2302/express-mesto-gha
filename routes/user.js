const userRouter = require('express').Router(); // создали роутер
const auth = require('../middlewares/auth');
const {
  getAllUser, getUser, login, createUser, updateUser, updateAvatar,
} = require('../controllers/user');

userRouter.post('/signin', login);

userRouter.post('/signup', createUser);

userRouter.use(auth);

userRouter.get('/users', getAllUser);

userRouter.get('/users/:id', getUser);

userRouter.patch('/users/me', updateUser);

userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter; // экспортировали роутер
