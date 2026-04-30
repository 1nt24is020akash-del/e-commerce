import express from 'express';
import Settings from '../models/settingsModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      // Create default settings if they don't exist
      settings = await Settings.create({
        banners: [],
        music: '',
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
  try {
    const { banners, music } = req.body;

    let settings = await Settings.findOne({});
    
    if (!settings) {
       settings = new Settings({
           banners: banners || [],
           music: music || '',
       });
    } else {
        if (banners !== undefined) settings.banners = banners;
        if (music !== undefined) settings.music = music;
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
