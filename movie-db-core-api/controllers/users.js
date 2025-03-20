const Users = require('../models/users')
const bcrypt = require('bcrypt')
const authUtils = require('../utils/auth')
const jwt = require('jsonwebtoken');


exports.createUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name  } = req.body; 
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Users({ email, password: hashedPassword, first_name, last_name });
        await user.save();

        authUtils.setCookie(res, user)

        return res.status(201).json({ 
            message: 'User registered', 
            user: {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });
    } catch (err) {
        if(err.code === 11000) {
            return res.status(409).json({ message: 'User already exists' });
        } else {
            return res.status(500).json({ message: err.message });
        }
    }
}


exports.login = async (req, res) => {
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
}


exports.checkAuth = async (req, res) => {
    const token = req.cookies.movie_db_nuxt_token;
    if(!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: 'User is authenticated', user: decoded });
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}


exports.logout = async (req, res) => {
    authUtils.removeCookie(res)
    return res.status(200).json({ message: 'User logged out' });
}