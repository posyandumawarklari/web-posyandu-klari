const router = require('express').Router();
const settingController = require('../controllers/setting.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');
const { handleUploadFields } = require('../middlewares/upload.middleware');

router.get('/', settingController.getAll);
router.put('/', verifyToken, adminOnly, handleUploadFields([{ name: 'logo', maxCount: 1 }, { name: 'hero_image', maxCount: 1 }]), settingController.update);

module.exports = router;
