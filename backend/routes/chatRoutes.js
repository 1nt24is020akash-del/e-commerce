import express from 'express';
import { getMessages, sendMessage, getChatUsers } from '../controllers/chatController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, sendMessage);

router.route('/users')
  .get(protect, admin, getChatUsers);

router.route('/:userId')
  .get(protect, getMessages);

export default router;
