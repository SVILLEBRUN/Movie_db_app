const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');



router.post('/register', userController.createUser)
router.post('/google-register', userController.googleRegister)

router.post('/login', userController.login)
router.post('/google-login', userController.googleLogin)

router.get('/check-auth', userController.checkAuth)

router.post('/logout', userController.logout)

module.exports = router