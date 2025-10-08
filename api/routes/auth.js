const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', usuarioController.loginUsuario);

// POST /api/auth/logout
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logout realizado com sucesso' });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/me
router.put('/me', authMiddleware, usuarioController.updateUsuario);

// POST /api/auth/change-password
router.post('/change-password/:id', authMiddleware, usuarioController.changePassword);

module.exports = router;
