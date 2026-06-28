const router = require('express').Router();
const settingController = require('../controllers/setting.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');
const { handleUpload } = require('../middlewares/upload.middleware');

router.get('/', settingController.getAll);
router.put('/', verifyToken, adminOnly, handleUpload('logo'), settingController.update);

module.exports = router;
