const router = require('express').Router();
const programController = require('../controllers/program.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { handleUpload } = require('../middlewares/upload.middleware');
const { programSchema } = require('../validations/general.validation');

router.get('/', programController.getAll);
router.get('/:id', programController.getById);

router.post('/', verifyToken, adminOnly, handleUpload('image'), validate(programSchema), programController.create);
router.put('/:id', verifyToken, adminOnly, handleUpload('image'), validate(programSchema), programController.update);
router.delete('/:id', verifyToken, adminOnly, programController.remove);

module.exports = router;
