const express               = require('express');
const router                = express.Router();
const helpController        = require('../controllers/helpController');

router.get('/confirmation/:token', helpController.activationAccount);

module.exports = router;