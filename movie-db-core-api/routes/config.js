const express = require('express')
const router = express.Router()
const Movie = require('../models/movies')
const movieCtrl = require('../controllers/movies')
const logger = require('../utils/logger')


// Ajout des films dans la base de donnée
router.get('/load_movies_data_in_database', async(req, res) => {
	try {
		// Lire le fichier JSON movies_data.json
		const movies_data = require('../data/movies_data.json')

		logger.info('load_movies_data_in_database - starting : ' + movies_data.length + ' movies to load')
		let num = 0
		for(const movie of movies_data) {
			num++
			if(num <= 1 || num % 10 == 0) logger.info('load_movies_data_in_database - '+Math.round(100 * num/movies_data.length)+'%')

			// On vérifie si le film est déjà en base de donnée (avec l'id)
			const movieExist = await Movie.findOne({ id: movie.id })
			if (movieExist) {
				// On update
				await Movie.updateOne({ id: movie.id }, movie)
			} else {
				// On insert
				const newMovie = new Movie({
					id: movie.id,
					original_title: movie.original_title,
					folder_name: movie.folder_name,
					original_language: movie.original_language,
					overview: movie.overview,
					belongs_to_collection: movie.belongs_to_collection,
					release_date: movie.release_date,
					genres: movie.genres,
					vote_average: movie.vote_average,
					poster_url: movie.poster_url,
					actors: movie.actors,
					keywords: movie.keywords
				})
				await newMovie.save()
			}
		}
		logger.info('load_movies_data_in_database - done')
		res.status(200).json({ message: 'Movies data loaded in database' })
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: err.message })
	}
})

module.exports = router