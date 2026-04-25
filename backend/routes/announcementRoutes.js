import express from 'express';
import { getAnnouncement, createAnnouncement } from '../controllers/announcementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAnnouncement)
  .post(protect, admin, createAnnouncement);

export default router;
