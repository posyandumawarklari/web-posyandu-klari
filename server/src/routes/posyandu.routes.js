const express = require('express');
const router = express.Router();
const posyanduController = require('../controllers/posyandu.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const posyanduValidation = require('../validations/posyandu.validation');

// Public access
router.get('/', posyanduController.getAll);
router.get('/:id', posyanduController.getById);

// Admin only
router.post('/', verifyToken, adminOnly, validate(posyanduValidation.create), posyanduController.create);
router.put('/:id', verifyToken, adminOnly, validate(posyanduValidation.update), posyanduController.update);
router.delete('/:id', verifyToken, adminOnly, posyanduController.remove);

module.exports = router;
