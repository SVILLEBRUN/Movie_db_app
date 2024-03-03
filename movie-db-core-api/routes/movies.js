const express = require('express')
const router = express.Router()
const Movie = require('../models/movies')
const movieCtrl = require('../controllers/movies')

// Getting all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find()
        res.json(movies)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one movie
router.get('/:id', (req, res) => {
    res.send(req.params.id)
})

// Creating one movie
router.post('/', movieCtrl.createMovie)

// Updating one movie
router.patch('/:id', (req, res) => {

})

// Deleting one movie
router.delete('/:id', (req, res) => {

})

module.exports = router
