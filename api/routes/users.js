const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// GET /api/users
router.get('/', authMiddleware, adminMiddleware, usuarioController.getAllUsuarios);

// GET /api/users/:id
router.get('/:id', authMiddleware, usuarioController.getUsuarioById);

// POST /api/users
router.post('/', authMiddleware, adminMiddleware, usuarioController.createUsuario);

// PUT /api/users/:id
router.put('/:id', authMiddleware, adminMiddleware, usuarioController.updateUsuario);

// DELETE /api/users/:id
router.delete('/:id', authMiddleware, adminMiddleware, usuarioController.deleteUsuario);

// GET /api/users/stats/overview
router.get('/stats/overview', authMiddleware, adminMiddleware, usuarioController.getUsuarioStats);

// GET /api/users/search
router.get('/search', authMiddleware, adminMiddleware, usuarioController.searchUsuarios);

// POST /api/users/:id/toggle-admin
router.post('/:id/toggle-admin', authMiddleware, adminMiddleware, usuarioController.toggleAdmin);

module.exports = router;
