require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors');

const corsOptions = {
	origin: process.env.VUE_APP_URL, // Remplacez par l'URL de votre application front-end
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true, // Si vous gérez des cookies
};
app.use(cors(corsOptions));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const moviesRouter = require('./routes/movies')
const configRouter = require('./routes/config')
app.use('/api/movies', moviesRouter)
app.use('/api/config', configRouter)

app.listen(3000, '0.0.0.0', () => console.log('Server Started'))