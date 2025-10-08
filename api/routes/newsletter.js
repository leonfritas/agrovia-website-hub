const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// POST /api/newsletter/subscribe
router.post('/subscribe', newsletterController.subscribe);

// POST /api/newsletter/unsubscribe
router.post('/unsubscribe', newsletterController.unsubscribe);

// GET /api/newsletter/subscribers
router.get('/subscribers', authMiddleware, adminMiddleware, newsletterController.getAllSubscribers);

// GET /api/newsletter/subscribers/:id
router.get('/subscribers/:id', authMiddleware, adminMiddleware, newsletterController.getSubscriberById);

// DELETE /api/newsletter/subscribers/:id
router.delete('/subscribers/:id', authMiddleware, adminMiddleware, newsletterController.deleteSubscriber);

// POST /api/newsletter/send
router.post('/send', authMiddleware, adminMiddleware, newsletterController.sendNewsletter);

module.exports = router;



