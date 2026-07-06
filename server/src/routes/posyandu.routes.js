const express = require('express');
const router = express.Router();
const posyanduController = require('../controllers/posyandu.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const posyanduValidation = require('../validations/posyandu.validation');

// Public access
router.get('/', posyanduController.getAll);
router.get('/:id', posyanduController.getById);

// Admin / Cadre only
router.use(verifyToken);
router.use(requireRole('ADMIN', 'CADRE'));

router.post('/', validate(posyanduValidation.create), posyanduController.create);
router.put('/:id', validate(posyanduValidation.update), posyanduController.update);
router.delete('/:id', posyanduController.remove);

module.exports = router;
