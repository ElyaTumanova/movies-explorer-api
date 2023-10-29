const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');

moviesRouter.get('/movies', getMovies);

moviesRouter.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().regex(/^(http|https):\/\/(\w|[-._~:/?#[\]@!$&'()*+,;=])|(#$)/),
      trailerLink: Joi.string().required().regex(/^(http|https):\/\/(\w|[-._~:/?#[\]@!$&'()*+,;=])|(#$)/),
      thumbnail: Joi.string().required().regex(/^(http|https):\/\/(\w|[-._~:/?#[\]@!$&'()*+,;=])|(#$)/),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

moviesRouter.delete(
  '/movies/:_id',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovieById,
);

module.exports = { moviesRouter };
