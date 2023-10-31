const express = require('express'); // подключение express

const app = express(); // создаем объект приложения

const { usersRouter, loginRouter, createUserRouter } = require('./users');
const { moviesRouter } = require('./movies');

const auth = require('../middlewares/auth');

module.exports = app.post('/signup', createUserRouter);
module.exports = app.post('/signin', loginRouter);

module.exports = app.use(auth);

module.exports = app.use('/', usersRouter);
module.exports = app.use('/', moviesRouter);
