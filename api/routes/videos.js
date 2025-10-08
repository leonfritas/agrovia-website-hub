const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// GET /api/videos
router.get('/', authMiddleware, videoController.getAllVideos);

// GET /api/videos/:id
router.get('/:id', authMiddleware, videoController.getVideoById);

// POST /api/videos
router.post('/', authMiddleware, videoController.createVideo);

// PUT /api/videos/:id
router.put('/:id', authMiddleware, videoController.updateVideo);

// DELETE /api/videos/:id
router.delete('/:id', authMiddleware, videoController.deleteVideo);

// GET /api/videos/categoria/:idCategoria
router.get('/categoria/:idCategoria', authMiddleware, videoController.getVideosByCategoria);

// GET /api/videos/usuario/:idUsuario
router.get('/usuario/:idUsuario', authMiddleware, videoController.getVideosByUsuario);

// GET /api/videos/search
router.get('/search', authMiddleware, videoController.searchVideos);

// GET /api/videos/recent
router.get('/recent', authMiddleware, videoController.getRecentVideos);

// GET /api/videos/type/:type
router.get('/type/:type', authMiddleware, videoController.getVideosByUrlType);

// GET /api/videos/date-range
router.get('/date-range', authMiddleware, videoController.getVideosByDateRange);

// GET /api/videos/stats
router.get('/stats', authMiddleware, adminMiddleware, videoController.getVideoStats);

module.exports = router;



