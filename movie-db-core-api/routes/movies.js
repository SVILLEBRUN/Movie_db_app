const express = require('express')
const router = express.Router()
const Movies = require('../models/movies')
const movieController = require('../controllers/movies')

// TODO: Put this in a controller
// Getting all movies
router.get('/', async (req, res) => {
    try {
		// const movies = await Movies.find()
        const movies = await Movies.find().limit(20)
        return res.json(movies)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// TODO: Put this in a controller
// Getting one movie
router.get('/:id', (req, res) => {
    return res.send(req.params.id)
})

// TODO: Put this in a controller
// Creating one movie
router.post('/', movieController.createMovie)

// TODO: Put this in a controller
// Updating one movie
router.patch('/:id', (req, res) => {

})

// TODO: Put this in a controller
// Deleting one movie
router.delete('/:id', (req, res) => {

})

module.exports = router
