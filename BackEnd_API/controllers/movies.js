const Movie = require('../models/movies');

exports.createMovie = (req, res, next) => {
  const movie = new Movie({
    title: req.body.title,
    original_language: req.body.original_language,
    genres: req.body.genres,
    overview: req.body.overview,
    poster_url: req.body.poster_url,
    actors: req.body.actors,
    keywords: req.body.keywords,
    folder_name: req.body.folder_name
  })
  movie.save()
    .then(() => res.status(201).json(newMovie))
    .catch((err) => res.status(400).json({ error: err }))
}
