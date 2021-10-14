require('dotenv').config();
const User          = require('../models/user');
const bcrypt        = require('bcrypt');
var jwt             = require('jsonwebtoken');
const saltRounds    = 10;

const login_index = (req, res) => {
    res.render('login');
}

const register_index = (req, res) => {
    res.render('register');
} 

const login_post = async (req, res) => {
    const { email, password } = req.body;

    const isEmailAvailable = await User.find({email})
        .then(result => result)
        .catch(error => error);
    
    if (isEmailAvailable.length > 0) {
        const isPasswordMatch = bcrypt.compareSync(password, isEmailAvailable[0].password);
        if ( isPasswordMatch ) {
            const token = jwt.sign({ user_id: isEmailAvailable[0]._id }, process.env.JWT_SECRET);
            const maxAge = 3 * 24 * 60 * 60;
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(200).json({ 
                status: 200,
                message: 'login successful'
            });
        } else {
            res.status(400).json({ 
                status: 400,
                message: 'Wrong email or password' 
            });
        }
    } else {
        res.status(400).json({ message: 'Email is not registered' });
    }
}

const register_post = async (req, res) => {
    const { full_name, email, password } = req.body;
    const isEmailRegistered = await User.find({email})
        .then(result => result)
        .catch(error => error);
        
    if (isEmailRegistered.length > 0) {
        res.status(400).json({ 
            status: 400,
            message: 'Email already registered'
        });
    } else {
        const hash = bcrypt.hashSync(password, saltRounds);
        const data = {
            full_name, email, password: hash
        }
        const user = new User(data);
        user.save()
            .then(() => {
                res.status(200).json({ 
                    status: 200,
                    message: 'register successful'
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: 'Server error', 
                    error
                });
            });
    }
}

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({
        status: 200,
        message: 'logout successful'
    });
}

module.exports = {
    login_index,
    login_post,
    register_index,
    register_post,
    logout_get
}