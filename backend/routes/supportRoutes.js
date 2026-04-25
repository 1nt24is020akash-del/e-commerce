import express from 'express';
import asyncHandler from 'express-async-handler';
import Support from '../models/supportModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Submit a support query
// @route   POST /api/support
// @access  Public
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    const support = new Support({
      name,
      email,
      subject,
      message,
      user: req.user ? req.user._id : null,
    });

    const createdSupport = await support.save();
    res.status(201).json(createdSupport);
  })
);

// @desc    Get all support queries
// @route   GET /api/support
// @access  Private/Admin
router.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const queries = await Support.find({}).sort({ createdAt: -1 });
    res.json(queries);
  })
);

// @desc    Update query status
// @route   PUT /api/support/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const query = await Support.findById(req.params.id);

    if (query) {
      query.status = req.body.status || query.status;
      const updatedQuery = await query.save();
      res.json(updatedQuery);
    } else {
      res.status(404);
      throw new Error('Support query not found');
    }
  })
);

export default router;
