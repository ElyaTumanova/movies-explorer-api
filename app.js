const express = require('express'); // подключение express
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const { errors } = require('celebrate'); // специальный мидлвэр celebrate для обработки ошибок
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env; // Слушаем 3000 порт
const app = express(); // создаем объект приложения

// импортируем роуты
const usersRouter = require('./routes/users');
const { moviesRouter } = require('./routes/movies');

// ошибки
const NotFoundError = require('./errors/not-found-err');
const errorHandler = require('./middlewares/error-handler');
const { errorLogger, requestLogger } = require('./middlewares/logger');

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

// подключаемся к БД
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(requestLogger); // подключаем логгер запросов

app.use(cors());

app.post('/signup', usersRouter);
app.post('/signin', usersRouter);

app.use(auth);

// запускаем роуты
app.use('/', usersRouter);
app.use('/', moviesRouter);

app.use('*', (req, res, next) => next(new NotFoundError()));

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);

// начинаем прослушивать подключения на 3000 порту
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
