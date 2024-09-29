const Movie = require('../models/movies');

exports.createMovie = (req, res) => {
	const movie = new Movie({
		id: req.body.id,
		original_title: req.body.original_title,
		folder_name: req.body.folder_name,
		original_language: req.body.original_language,
		overview: req.body.overview,
		belongs_to_collection: req.body.belongs_to_collection,
		release_date: req.body.release_date,
		genres: req.body.genres,
		vote_average: req.body.vote_average,
		poster_url: req.body.poster_url,
		actors: req.body.actors,
		keywords: req.body.keywords
	})
	movie.save()
		.then(() => res.status(201).json(newMovie))
		.catch((err) => res.status(400).json({ error: err }))
}
