const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? message // 'На сервере произошла ошибка123'
      : message,
  });
  next();
};

module.exports = errorHandler;
