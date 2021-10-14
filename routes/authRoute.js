const express               = require('express');
const router                = express.Router();
const authController        = require('../controllers/authController');
const { requireUnauth }     = require('../middleware/authMiddleware');

router.get('/register', requireUnauth, authController.register_index);
router.post('/register', requireUnauth, authController.register_post);
router.get('/login', requireUnauth, authController.login_index);
router.post('/login', requireUnauth, authController.login_post);
router.get('/logout', authController.logout_get);

module.exports = router;