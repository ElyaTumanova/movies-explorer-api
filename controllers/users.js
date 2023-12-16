const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-error');
const AuthError = require('../errors/auth-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => next(err));
};

module.exports.updateMyUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { runValidators: true, new: true }).orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError());
      } if (err.code === 11000) {
        return next(new ConflictError());
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(201).send({
      name, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError());
      } if (err.code === 11000) {
        return next(new ConflictError());
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        console.log('no user');
        next(new AuthError('Пользователь не найден'));
        // return Promise.reject(new AuthError('Пользователь не найден'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            console.log('no match');
            next(new AuthError('Пользователь или пароль указаны не верно'));
            // return Promise.reject(new AuthError('Пользователь или пароль указаны не верно'));
          }

          return user; // теперь user доступен
        });
    })
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      // вернём токен
      return res.send({ token });
    })
    .catch(() => (new AuthError('Email или пароль указаны не верно')));
};

// module.exports.login = (req, res) => {
//   const { email, password } = req.body;

//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       // создадим токен
//       const token = jwt.sign({ _id: user._id },
// NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
//       // вернём токен
//       return res.send({ token });
//     })
//     .catch(() => (new AuthError('Email или пароль указаны не верно')));
// };
