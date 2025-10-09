const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// POST /api/contact
router.post('/', contactController.sendMessage);

// GET /api/contact
router.get('/', authMiddleware, adminMiddleware, contactController.getAllMessages);

// GET /api/contact/:id
router.get('/:id', authMiddleware, adminMiddleware, contactController.getMessageById);

// PUT /api/contact/:id/status
router.put('/:id/status', authMiddleware, adminMiddleware, contactController.updateMessageStatus);

// DELETE /api/contact/:id
router.delete('/:id', authMiddleware, adminMiddleware, contactController.deleteMessage);

module.exports = router;




