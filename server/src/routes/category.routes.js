const router = require('express').Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { categorySchema } = require('../validations/category.validation');

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin only
router.post('/', verifyToken, adminOnly, validate(categorySchema), categoryController.create);
router.put('/:id', verifyToken, adminOnly, validate(categorySchema), categoryController.update);
router.delete('/:id', verifyToken, adminOnly, categoryController.remove);

module.exports = router;
