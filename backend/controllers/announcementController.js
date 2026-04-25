import asyncHandler from 'express-async-handler';
import Announcement from '../models/announcementModel.js';

// @desc    Get latest active announcement
// @route   GET /api/announcements
// @access  Public
const getAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findOne({ isActive: true }).sort({ createdAt: -1 });
  res.json(announcement);
});

// @desc    Create/Update announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // Deactivate old announcements
  await Announcement.updateMany({}, { isActive: false });

  const announcement = await Announcement.create({
    message,
    isActive: true,
    author: req.user._id,
  });

  res.status(201).json(announcement);
});

export { getAnnouncement, createAnnouncement };
