const usersRouter = require('express').Router();
const createUserRouter = require('express').Router();
const loginRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMyUser, updateMyUser, createUser, login,
} = require('../controllers/users');

usersRouter.get('/users/me', getMyUser);

usersRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateMyUser,
);

createUserRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

loginRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

module.exports = { usersRouter, loginRouter, createUserRouter };
