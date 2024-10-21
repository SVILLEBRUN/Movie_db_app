const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
require('dotenv').config()

const app = express()

// Database connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


// Routes
const moviesRouter = require('./routes/movies')
const configRouter = require('./routes/config')
app.use('/movie-db-app/api/movies', moviesRouter)
app.use('/movie-db-app/api/config', configRouter)

// Enable CORS
const corsOptions = {
	origin: process.env.VUE_APP_URL, // Remplacez par l'URL de votre application front-end
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true, // Si vous gérez des cookies
};
app.use(cors(corsOptions));

app.use(express.json())

app.listen(3000, '0.0.0.0', () => console.log('Server Started'))