import express from 'express';
import { subscribe, sendNotification } from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/subscribe', protect, subscribe);
router.post('/send', protect, admin, sendNotification);

export default router;
