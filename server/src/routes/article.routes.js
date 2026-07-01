const router = require('express').Router();
const articleController = require('../controllers/article.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authenticated } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { handleUpload } = require('../middlewares/upload.middleware');
const { createArticleSchema, updateArticleSchema } = require('../validations/article.validation');

// Protected routes — Admin + Cadre
router.get('/', verifyToken, authenticated, articleController.getAll);
router.get('/:id', verifyToken, authenticated, articleController.getById);
router.get('/slug/:slug', verifyToken, authenticated, articleController.getBySlug);
router.post('/', verifyToken, authenticated, handleUpload('thumbnail'), validate(createArticleSchema), articleController.create);
router.put('/:id', verifyToken, authenticated, handleUpload('thumbnail'), validate(updateArticleSchema), articleController.update);
router.patch('/:id/status', verifyToken, authenticated, articleController.updateStatus);
router.delete('/:id', verifyToken, authenticated, articleController.remove);

module.exports = router;
