const router = require('express').Router();
const galleryController = require('../controllers/gallery.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authenticated, adminOnly } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { handleUpload } = require('../middlewares/upload.middleware');
const { gallerySchema } = require('../validations/general.validation');

router.get('/', galleryController.getAll);
router.get('/:id', galleryController.getById);

// Admin and Cadre can upload
router.post('/', verifyToken, authenticated, handleUpload('image'), validate(gallerySchema), galleryController.create);
router.put('/:id', verifyToken, authenticated, handleUpload('image'), validate(gallerySchema), galleryController.update);
router.delete('/:id', verifyToken, authenticated, galleryController.remove);

module.exports = router;
