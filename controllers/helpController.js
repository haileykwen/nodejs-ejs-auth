require('dotenv').config();
const jwt                   = require('jsonwebtoken');
const User                  = require('../models/user');

const activationAccount = (req, res) => {
    const { token } = req.params;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.status(500).json({
                    status: 500,
                    message: 'Server error'
                });
            } else {
                User.findById(decodedToken.user_id, (err, user) => {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: 'Server error'
                        });
                    } else {
                        if (user.confirmation === true) {
                            res.status(400).json({
                                status: 400,
                                message: 'Your account is activated'
                            });
                        } else {
                            User.updateOne({ _id: decodedToken.user_id}, { $set:{confirmation: true} }, function(err, result) {
                                if (err) {
                                    res.status(500).json({
                                        status: 500,
                                        message: 'Server error'
                                    });
                                } else {
                                    res.status(200).json({
                                        status: 200,
                                        message: 'Activation successful'
                                    });
                                }
                            });
                        }
                    }
                })
            }
        });
    }
}

module.exports = {
    activationAccount
}