const router = require('express').Router();
const tagController = require('../controllers/tag.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authenticated } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { tagSchema } = require('../validations/tag.validation');

router.get('/', tagController.getAll);
router.get('/:id', tagController.getById);

router.post('/', verifyToken, authenticated, validate(tagSchema), tagController.create);
router.put('/:id', verifyToken, authenticated, validate(tagSchema), tagController.update);
router.delete('/:id', verifyToken, authenticated, tagController.remove);

module.exports = router;
