const router = require('express').Router();
const programController = require('../controllers/program.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authenticated } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { handleUpload } = require('../middlewares/upload.middleware');
const { programSchema } = require('../validations/general.validation');

router.get('/', programController.getAll);
router.get('/:id', programController.getById);

router.post('/', verifyToken, authenticated, handleUpload('image'), validate(programSchema), programController.create);
router.put('/:id', verifyToken, authenticated, handleUpload('image'), validate(programSchema), programController.update);
router.delete('/:id', verifyToken, authenticated, programController.remove);

module.exports = router;
