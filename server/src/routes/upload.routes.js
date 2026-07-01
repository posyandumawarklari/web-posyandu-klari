const router = require('express').Router();
const uploadController = require('../controllers/upload.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authenticated } = require('../middlewares/role.middleware');
const { handleUpload } = require('../middlewares/upload.middleware');

router.use(verifyToken, authenticated);
router.post('/', handleUpload('image'), uploadController.uploadImage);

module.exports = router;
