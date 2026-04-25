import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';

// @desc    Get messages for a user
// @route   GET /api/chat/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.params.userId },
      { receiver: req.params.userId }
    ]
  }).sort({ createdAt: 1 });
  res.json(messages);
});

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { text, receiverId } = req.body;
  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId || null, // null if broadcast-like or to admin
    text,
    isAdmin: req.user.isAdmin
  });

  const io = req.app.get('socketio');
  io.emit('message', message); // Global for simplicity, can be room-based later

  res.status(201).json(message);
});

// @desc    Get all unique users who have chatted
// @route   GET /api/chat/users
// @access  Private/Admin
const getChatUsers = asyncHandler(async (req, res) => {
  const messages = await Message.find({}).populate('sender', 'name email');
  const userMap = new Map();
  messages.forEach(m => {
    if (!m.isAdmin) {
      userMap.set(m.sender._id.toString(), m.sender);
    }
  });
  res.json(Array.from(userMap.values()));
});

export { getMessages, sendMessage, getChatUsers };
