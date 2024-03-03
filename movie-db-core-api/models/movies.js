const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: true
    },
    original_language: {
        type: String,
        // required: true
    },
    genres: {
        type: Array,
        // required: true
    },
    overview: {
        type: String,
        // required: true
    },
    poster_url: {
        type: String,
        // required: true
    },
    actors: {
        type: Array,
        // required: true
    },
    keywords: {
        type: Array,
        // required: true
    },
    folder_name: {
        type: String,
        // required: true
    }
})

module.exports = mongoose.model('Movie', movieSchema);