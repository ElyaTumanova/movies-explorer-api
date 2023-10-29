const express = require('express'); // подключение express

const app = express(); // создаем объект приложения

// импортируем роуты
const usersRouter = require('./users');
const { moviesRouter } = require('./movies');

const auth = require('../middlewares/auth');

module.exports = app.post('/signup', usersRouter);
module.exports = app.post('/signin', usersRouter);

module.exports = app.use(auth);

// запускаем роуты
module.exports = app.use('/', usersRouter);
module.exports = app.use('/', moviesRouter);
