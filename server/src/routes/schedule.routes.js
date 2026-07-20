const router = require('express').Router();
const scheduleController = require('../controllers/schedule.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authenticated } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { scheduleSchema } = require('../validations/general.validation');

router.get('/', scheduleController.getAll);
router.get('/:id', scheduleController.getById);

router.post('/', verifyToken, authenticated, validate(scheduleSchema), scheduleController.create);
router.put('/:id', verifyToken, authenticated, validate(scheduleSchema), scheduleController.update);
router.delete('/:id', verifyToken, authenticated, scheduleController.remove);

module.exports = router;
