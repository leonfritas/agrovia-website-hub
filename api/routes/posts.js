const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// GET /api/posts
router.get('/', authMiddleware, postController.getAllPosts);

// GET /api/posts/:id
router.get('/:id', authMiddleware, postController.getPostById);

// POST /api/posts
router.post('/', authMiddleware, postController.createPost);

// PUT /api/posts/:id
router.put('/:id', authMiddleware, postController.updatePost);

// DELETE /api/posts/:id
router.delete('/:id', authMiddleware, postController.deletePost);

// GET /api/posts/categoria/:idCategoria
router.get('/categoria/:idCategoria', authMiddleware, postController.getPostsByCategoria);

// GET /api/posts/usuario/:idUsuario
router.get('/usuario/:idUsuario', authMiddleware, postController.getPostsByUsuario);

// GET /api/posts/search
router.get('/search', authMiddleware, postController.searchPosts);

// GET /api/posts/recent
router.get('/recent', authMiddleware, postController.getRecentPosts);

// GET /api/posts/stats
router.get('/stats', authMiddleware, adminMiddleware, postController.getPostStats);

module.exports = router;



