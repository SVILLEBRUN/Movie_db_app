const express = require('express')
const router = express.Router()
const Movies = require('../models/movies')
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
			const movieExist = await Movies.findOne({ id: movie.id })
			if (movieExist) {
				// On update
				await Movies.updateOne({ id: movie.id }, movie)
			} else {
				// On insert
				const newMovie = new Movies({
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
		return res.status(200).json({ message: 'Movies data loaded in database' })
	} catch (err) {
		logger.error(err)
		console.log(err)
		return res.status(500).json({ message: err.message })
	}
})



// Modification de donnée dans la base 
// Crédits du film : https://api.themoviedb.org/3/movie/49538/credits?api_key=fde5eec290651347ef46855a96301aaa&language=fr-FR
// Recherche d'un film : https://api.themoviedb.org/3/movie/49538?api_key=fde5eec290651347ef46855a96301aaa&language=fr-FR
// Keywords : "https://api.themoviedb.org/3/movie/49538/keywords?api_key=fde5eec290651347ef46855a96301aaa&language=fr-FR"


/*
	TODO :
		- Améliorer les données acteurs
		- Améliorer les données genres
*/
router.get('/fix_data_in_db', async(req, res) => {
	try {
		logger.info('fix_data_in_db - starting')
		const movies = await Movies.find()

		const bulk = Movies.collection.initializeUnorderedBulkOp();
		let bulk_to_execute = false
		
		let idx = 0
		for(let movie of movies) {
			idx++
			if(idx <= 1 || idx % 10 == 0) logger.info('fix_data_in_db - '+Math.round(100 * idx/movies.length)+'%')

			if(movie.original_language == 'en') {
				const movie_id = movie.id
				const url = "https://api.themoviedb.org/3/movie/"+movie_id+"?api_key=fde5eec290651347ef46855a96301aaa"
				const response = await fetch(url)
				if (!response.ok) {
					throw new Error('Network response was not ok: ' + response.statusText);
				}
				const data = await response.json()
				const poster_path = data.poster_path

				const base_poster_url = 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2'

				const poster_url = base_poster_url + poster_path
				
				bulk.find({ _id: movie._id }).updateOne({ $set: { poster_url: poster_url } });
				bulk_to_execute = true
			}
		}
		if(bulk_to_execute)	bulk.execute();
		logger.info('fix_data_in_db - done')
		return res.status(200).json({ message: 'Movies data updated' })
	} catch(err) {
		logger.error(err)
		console.log(err)
		return res.status(500).json({ message: err.message })
	}
})

module.exports = router