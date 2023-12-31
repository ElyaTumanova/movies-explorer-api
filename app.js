const express = require('express'); // подключение express
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const { errors } = require('celebrate'); // специальный мидлвэр celebrate для обработки ошибок

const serverPath = require('./utils/constants');

const { PORT = 3000, DB, NODE_ENV } = process.env; // Слушаем 3000 порт
const app = express(); // создаем объект приложения

const routing = require('./routes/index');

// ошибки
const errorHandler = require('./middlewares/error-handler');
const { errorLogger, requestLogger } = require('./middlewares/logger');

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

// подключаемся к БД
mongoose.connect(NODE_ENV === 'production' ? DB : serverPath, {
  useNewUrlParser: true,
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(requestLogger); // подключаем логгер запросов

app.use(cors());

app.use(routing);

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);

// начинаем прослушивать подключения на 3000 порту
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
