const express = require('express'); // подключение express

const app = express(); // создаем объект приложения

const { usersRouter, loginRouter, createUserRouter } = require('./users');
const { moviesRouter } = require('./movies');

const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/not-found-err');

module.exports = app.post('/signup', createUserRouter);
module.exports = app.post('/signin', loginRouter);

module.exports = app.use(auth);

module.exports = app.use('/', usersRouter);
module.exports = app.use('/', moviesRouter);

module.exports = app.use('*', (req, res, next) => next(new NotFoundError()));
