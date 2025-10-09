const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { uploadPostImages } = require('../middleware/upload');

// GET /api/posts
router.get('/', authMiddleware, postController.getAllPosts);

// Rotas específicas ANTES das rotas com parâmetros dinâmicos
// GET /api/posts/secao/:nomeCategoria (público - para o site)
router.get('/secao/:nomeCategoria', postController.getPostsByCategoriaName);

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

// GET /api/posts/:id (público - para visualização de post individual)
router.get('/:id', postController.getPostById);

// POST /api/posts
router.post('/', authMiddleware, uploadPostImages, postController.createPost);

// PUT /api/posts/:id
router.put('/:id', authMiddleware, uploadPostImages, postController.updatePost);

// DELETE /api/posts/:id
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;




