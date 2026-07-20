const router = require('express').Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authenticated } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { categorySchema } = require('../validations/category.validation');

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin only
router.post('/', verifyToken, authenticated, validate(categorySchema), categoryController.create);
router.put('/:id', verifyToken, authenticated, validate(categorySchema), categoryController.update);
router.delete('/:id', verifyToken, authenticated, categoryController.remove);

module.exports = router;
