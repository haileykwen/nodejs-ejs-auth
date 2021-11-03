const express               = require('express');
const router                = express.Router();
const helpController        = require('../controllers/helpController');

router.get('/confirmation/:token', helpController.activationAccount);
router.get('/forgot-password', helpController.get_forgotPassword);
router.post('/forgot-password', helpController.post_forgotPassword);
router.get('/reset-password/:token', helpController.get_resetPassword);
router.post('/reset-password', helpController.post_resetPassword);

module.exports = router;