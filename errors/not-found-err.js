class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.message = !message ? 'Страница не найдена' : message;
  }
}

module.exports = NotFoundError;
