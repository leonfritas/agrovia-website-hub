const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// GET /api/categorias
router.get('/', authMiddleware, categoriaController.getAllCategorias);

// GET /api/categorias/site - Para o frontend (sem autenticação)
router.get('/site', categoriaController.getAllCategoriasForSite);

// GET /api/categorias/:id
router.get('/:id', authMiddleware, categoriaController.getCategoriaById);

// POST /api/categorias
router.post('/', authMiddleware, adminMiddleware, categoriaController.createCategoria);

// PUT /api/categorias/:id
router.put('/:id', authMiddleware, adminMiddleware, categoriaController.updateCategoria);

// DELETE /api/categorias/:id
router.delete('/:id', authMiddleware, adminMiddleware, categoriaController.deleteCategoria);

// GET /api/categorias/with-posts
router.get('/with-posts', authMiddleware, categoriaController.getCategoriasWithPosts);

// GET /api/categorias/search
router.get('/search', authMiddleware, categoriaController.searchCategorias);

module.exports = router;




