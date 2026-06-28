const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authenticated } = require('../middlewares/role.middleware');

router.get('/stats', verifyToken, authenticated, dashboardController.getStats);

module.exports = router;
