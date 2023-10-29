class ForbiddenRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.message = 'Нелья удалить фильм';
  }
}

module.exports = ForbiddenRequestError;
