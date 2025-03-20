const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');



router.post('/register', userController.createUser)

router.post('/login', userController.login)

router.get('/check-auth', userController.checkAuth)

router.post('/logout', userController.logout)

module.exports = router