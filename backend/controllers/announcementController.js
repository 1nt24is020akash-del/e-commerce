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

    // 2. Send WhatsApp (Using Template for API like Ultramsg/Twilio)
    if (user.phone) {
      try {
        // This is a template for WhatsApp API integration
        // For production, replace with your API Key and Instance ID
        const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || ''; 
        if (WHATSAPP_API_URL) {
          await axios.post(WHATSAPP_API_URL, {
            token: process.env.WHATSAPP_TOKEN,
            to: user.phone,
            body: `🛍️ *MERN E-Shop Update*\n\n${message}\n\nVisit: https://e-commerce-o2zc.onrender.com`
          });
        } else {
          console.log(`[SIMULATED WHATSAPP] To: ${user.phone}, Msg: ${message}`);
        }
      } catch (error) {
        console.error(`WhatsApp failed for ${user.phone}:`, error);
      }
    }
  }

  res.status(201).json(announcement);
});

export { getAnnouncement, createAnnouncement };
