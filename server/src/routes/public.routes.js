const router = require('express').Router();
const publicController = require('../controllers/public.controller');

// All public routes — no authentication required
router.get('/home', publicController.getHomePage);
router.get('/articles', publicController.getArticles);
router.get('/articles/:slug', publicController.getArticleBySlug);

module.exports = router;
