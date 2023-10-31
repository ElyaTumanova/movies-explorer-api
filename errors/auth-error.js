class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = !message ? 'Необходима авторизация!' : message;
  }
}

module.exports = AuthError;
