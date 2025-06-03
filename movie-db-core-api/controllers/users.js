const Users = require('../models/users')
const bcrypt = require('bcryptjs')
const authUtils = require('../utils/auth')
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');


exports.createUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name  } = req.body;
        // TODO: Add validations for email and password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Users({ email, password: hashedPassword, first_name, last_name, authMethod: 'local' });
        await user.save();

        authUtils.setCookie(res, user)

        return res.status(201).json({ 
            message: 'User registered', 
            user: {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                avatar: user.avatar || null,
                authMethod: 'local'
            }
        });
    } catch (err) {
        if(err.code === 11000) {
            return res.status(409).json({ message: 'User already exists' });
        } else {
            console.log(err.message)
            return res.status(500).json({ message: err.message });
        }
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleRegister = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload();
        if(!payload.given_name || !payload.family_name || !payload.email) {
            return res.status(500).json({ message: 'Google information missing' });
        }
        
        const user = new Users({ email: payload.email, first_name: payload.given_name, last_name: payload.family_name, authMethod: 'google' });
        await user.save();

        authUtils.setCookie(res, user)

        return res.status(201).json({ 
            message: 'User registered', 
            user: {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                avatar: user.avatar || null,
                authMethod: 'google'
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
        const user = await Users.findOne({ email, authMethod: 'local' });
        if(user && await bcrypt.compare(password, user.password)) {
            authUtils.setCookie(res, user)
            
            return res.status(200).json({ 
                message: 'User logged in', 
                user: {
                    _id: user._id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    avatar: user.avatar || null,
                    authMethod: 'local'
                } 
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload();
        if(!payload.given_name || !payload.family_name || !payload.email) {
            return res.status(500).json({ message: 'Google information missing' });
        }
        const user = await Users.findOne({ email: payload.email, authMethod: 'google' });
        if(user) {
            authUtils.setCookie(res, user)
            return res.status(200).json({ 
                message: 'User logged in', 
                user: {
                    _id: user._id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    avatar: user.avatar || null,
                    authMethod: 'google'
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