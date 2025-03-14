const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const userController = require('../controllers/users');
const bcrypt = require('bcrypt');
const authUtils = require('../utils/auth')
const jwt = require('jsonwebtoken');




router.post('/register', userController.createUser)

// TODO: Put this in a controller
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if(user && await bcrypt.compare(password, user.password)) {
            authUtils.setCookie(res, user)
            
            return res.status(200).json({ 
                message: 'User logged in', 
                user: {
                    _id: user._id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name
                } 
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// TODO: Put this in a controller
router.get('/check-auth', (req, res) => {
    const token = req.cookies.movie_db_nuxt_token;
    if(!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: 'User is authenticated', user: decoded });
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
})

// TODO: Put this in a controller
router.post('/logout', (req, res) => {
    authUtils.removeCookie(res)
    return res.status(200).json({ message: 'User logged out' });
})

module.exports = router