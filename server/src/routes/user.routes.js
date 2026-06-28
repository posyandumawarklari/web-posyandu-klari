const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { handleUpload } = require('../middlewares/upload.middleware');
const { createUserSchema, updateUserSchema, resetPasswordSchema } = require('../validations/user.validation');

// All user routes require admin
router.use(verifyToken, adminOnly);

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', handleUpload('avatar'), validate(createUserSchema), userController.create);
router.put('/:id', handleUpload('avatar'), validate(updateUserSchema), userController.update);
router.delete('/:id', userController.remove);
router.patch('/:id/reset-password', validate(resetPasswordSchema), userController.resetPassword);

module.exports = router;
