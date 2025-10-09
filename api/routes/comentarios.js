const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// POST /api/comentarios - Criar comentário (público)
router.post('/', comentarioController.createComentario);

// GET /api/comentarios/post/:idPost - Obter comentários de um post (público)
router.get('/post/:idPost', comentarioController.getComentariosByPost);

// GET /api/comentarios/pending - Obter comentários pendentes (admin)
router.get('/pending', authMiddleware, adminMiddleware, comentarioController.getPendingComentarios);

// PUT /api/comentarios/:id/approve - Aprovar comentário (admin)
router.put('/:id/approve', authMiddleware, adminMiddleware, comentarioController.approveComentario);

// PUT /api/comentarios/:id/reject - Rejeitar comentário (admin)
router.put('/:id/reject', authMiddleware, adminMiddleware, comentarioController.rejectComentario);

// DELETE /api/comentarios/:id - Deletar comentário (admin)
router.delete('/:id', authMiddleware, adminMiddleware, comentarioController.deleteComentario);

// POST /api/comentarios/test-moderation - Testar moderação (admin)
router.post('/test-moderation', authMiddleware, adminMiddleware, comentarioController.testModeration);

module.exports = router;
