const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { handleUpload } = require('../middlewares/upload.middleware');
const {
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateProfileSchema,
} = require('../validations/auth.validation');

// Public routes
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.put(
  '/profile',
  verifyToken,
  handleUpload('avatar'),
  validate(updateProfileSchema),
  authController.updateProfile
);
router.put(
  '/change-password',
  verifyToken,
  validate(changePasswordSchema),
  authController.changePassword
);

module.exports = router;
