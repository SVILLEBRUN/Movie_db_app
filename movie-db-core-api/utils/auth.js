const jwt = require('jsonwebtoken');

const setCookie = (res, user) => {
    if(!user || !user.email || !user._id) return res.status(401).json({ message: 'Invalid user data, please try to login again' });
    
    const token_payload = { 
        email: user.email, 
        _id: user._id, 
        first_name: user.first_name, 
        last_name: user.last_name, 
        avatar: user.avatar || null, 
        authMethod: user.authMethod 
    };
    const token = jwt.sign(token_payload, process.env.JWT_SECRET);

    return res.cookie('movie_db_nuxt_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 // 1 hour
    });
}

const removeCookie = (res) => {
    return res.clearCookie('movie_db_nuxt_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
}

            

module.exports = {
    setCookie,
    removeCookie
}