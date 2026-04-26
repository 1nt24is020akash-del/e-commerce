import asyncHandler from 'express-async-handler';
import Announcement from '../models/announcementModel.js';
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Get latest active announcement
// @route   GET /api/announcements
// @access  Public
const getAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findOne({ isActive: true }).sort({ createdAt: -1 });
  res.json(announcement);
});

import axios from 'axios';

// Helper to format phone for WhatsApp (adds country code if 10 digits)
const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 ? `91${cleaned}` : cleaned;
};

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

  // Emit socket event for real-time notification
  const io = req.app.get('socketio');
  io.emit('newAnnouncement', { message });

  const users = await User.find({});
  
  // WhatsApp Configuration (e.g. from Ultramsg)
  const WHATSAPP_INSTANCE_ID = process.env.WHATSAPP_INSTANCE_ID;
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  
  // Process all users for Email and WhatsApp
  for (const user of users) {
    // 1. Send Email
    try {
      await sendEmail({
        email: user.email,
        subject: 'New Update from MERN E-Shop!',
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #6366f1;">📢 New Announcement!</h2>
            <p style="font-size: 1.1rem; line-height: 1.6;">${message}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.8rem; color: #888; text-align: center;">Check out the latest offers on our website.</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://e-commerce-o2zc.onrender.com" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Store</a>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error(`Email failed for ${user.email}:`, error);
    }

    // 2. Send WhatsApp
    if (user.phone) {
      const formattedPhone = formatPhone(user.phone);
      try {
        if (WHATSAPP_INSTANCE_ID && WHATSAPP_TOKEN) {
          // Ultramsg.com API structure (ideal for personal numbers)
          await axios.post(`https://api.ultramsg.com/${WHATSAPP_INSTANCE_ID}/messages/chat`, {
            token: WHATSAPP_TOKEN,
            to: formattedPhone,
            body: `🛍️ *MERN E-Shop Update*\n\n${message}\n\nVisit: https://e-commerce-o2zc.onrender.com`
          });
          console.log(`WhatsApp sent to ${formattedPhone}`);
        } else {
          console.log(`[SIMULATED WHATSAPP] To: ${formattedPhone}, Msg: ${message}`);
        }
      } catch (error) {
        console.error(`WhatsApp failed for ${formattedPhone}:`, error?.response?.data || error.message);
      }
    }
  }

  res.status(201).json(announcement);
});

export { getAnnouncement, createAnnouncement };
