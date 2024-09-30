const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
	id: { // ID IMBD // unique
		type: Number,
		required: true,
		unique: true
	},
    original_title: {
        type: String,
        required: true
    },
	folder_name: {
        type: String,
        required: true
    },
	original_language: {
        type: String,
        required: false
    },
	overview: {
        type: String,
        required: false
    },
	belongs_to_collection: {
		type: Object,
		required: false
	},
	release_date: {
		type: String,
		required: false
	},
	genres: {
        type: Array,
        required: false
    },
	vote_average: {
		type: Number,
		required: false
	},
	poster_url: {
        type: String,
        required: false
    },
	actors: {
        type: Array,
        required: false
    },
    keywords: {
        type: Array,
        required: false
    }
})

module.exports = mongoose.model('Movies', moviesSchema);