require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET    = process.env.JWT_SECRET;

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/auth/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/auth/login');
    }
};

const requireUnauth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                next();
            } else {
                console.log(decodedToken);
                res.redirect('/app');
            }
        });
    } else {
        next();
    }
};

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.user_id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};


module.exports = { 
    requireAuth, 
    checkUser,
    requireUnauth 
};