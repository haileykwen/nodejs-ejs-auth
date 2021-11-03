require('dotenv').config();
const jwt                   = require('jsonwebtoken');
const User                  = require('../models/user');
const nodemailer            = require('nodemailer');
const bcrypt                = require('bcrypt');
const saltRounds            = 10;

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

const get_forgotPassword = (req, res) => {
    res.render('forgotPassword');
}

const post_forgotPassword = (req, res) => {
    const { email } = req.body
    User.find( { "email": email } )
        .then(data => {
            if (data.length < 1) {
                res.status(400).json({
                    status: 400,
                    message: 'Invalid email'
                })
            } else {
                const user = data[0];
                if (user.confirmation === false) {
                    res.status(400).json({
                        status: 400,
                        message: 'Your account is not activated yet'
                    })
                } else {
                    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                    sendEmailForgotPassword(
                        user.email, token,
                        () => {
                            res.status(200).json({
                                status: 200,
                                message: 'We just send a link to your email for update your password'
                            });
                        },
                        () => {
                            res.status(500).json({
                                status: 500,
                                message: 'Something error with the server'
                            });
                        }
                    );
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                err
            })
        })
}

const sendEmailForgotPassword = (receiver, token, cs, ce) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: receiver,
        subject: 'Reset Password',
        html: `<p>Click <a href="${process.env.BASE_URL}/help/reset-password/${token}">here</a> to reset your password.</p>`
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log('error', err);
            ce();
        } else {
            console.log(`email sent to ${receiver}`, data);
            cs();
        }
    });
}

const get_resetPassword = (req, res) => {
    const { token } = req.params;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.status(500).json({
                    status: 500,
                    message: 'Server error'
                });
            } else {
                res.cookie('reset_password_token', token, { httpOnly: true });
                res.render('resetPassword');
            }
        });
    }
}

const post_resetPassword = (req, res) => {
    const { newPassword } = req.body;
    const token = req.cookies.reset_password_token;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.status(500).json({
                    status: 500,
                    message: 'Server error'
                });
            } else {
                const hash = bcrypt.hashSync(newPassword, saltRounds);
                User.updateOne({ _id: decodedToken.user_id}, { $set:{password: hash} }, function(err, result) {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: 'Server error'
                        });
                    } else {
                        res.cookie('reset-password-token', '');
                        res.status(200).json({
                            status: 200,
                            message: 'Reset password successful'
                        });
                    }
                });
            }
        });
    } else {
        res.status(400).json({
            status: 400,
            message: "You don't have access"
        });
    }
}

module.exports = {
    activationAccount,
    get_forgotPassword,
    post_forgotPassword,
    get_resetPassword,
    post_resetPassword
}