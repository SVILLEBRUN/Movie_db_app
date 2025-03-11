const Users = require('../models/users')
const bcrypt = require('bcrypt')
const authUtils = require('../utils/auth')


exports.createUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name  } = req.body; 
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Users({ email, password: hashedPassword, first_name, last_name });
        await user.save();

        authUtils.setCookie(res, user)

        res.status(201).json({ 
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
            res.status(409).json({ message: 'User already exists' });
        } else {
            res.status(500).json({ message: err.message });
        }
    }
}