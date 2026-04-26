import asyncHandler from 'express-async-handler';
import webpush from 'web-push';
import Subscription from '../models/subscriptionModel.js';
import dotenv from 'dotenv';

dotenv.config();

webpush.setVapidDetails(
  'mailto:akashs14102005@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// @desc    Subscribe to push notifications
// @route   POST /api/notifications/subscribe
// @access  Public
const subscribe = asyncHandler(async (req, res) => {
  const { subscription } = req.body;

  // Check if subscription already exists to avoid duplicates
  const existingSubscription = await Subscription.findOne({ 'subscription.endpoint': subscription.endpoint });
  
  if (existingSubscription) {
    existingSubscription.user = req.user ? req.user._id : null;
    await existingSubscription.save();
    return res.status(200).json({ message: 'Subscription updated' });
  }

  const newSubscription = new Subscription({
    user: req.user ? req.user._id : null,
    subscription
  });

  await newSubscription.save();
  res.status(201).json({ message: 'Subscribed successfully' });
});

// @desc    Send push notification to all subscribers
// @route   POST /api/notifications/send
// @access  Private/Admin
const sendNotification = asyncHandler(async (req, res) => {
  const { title, body, icon, url } = req.body;

  const subscriptions = await Subscription.find({});

  const payload = JSON.stringify({
    title: title || 'MERN E-Shop Notification',
    body: body || 'You have a new update!',
    icon: icon || '/logo192.png',
    data: {
      url: url || '/'
    }
  });

  const pushPromises = subscriptions.map(sub => {
    return webpush.sendNotification(sub.subscription, payload).catch(err => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        // Subscription expired or removed, delete it from DB
        return Subscription.deleteOne({ _id: sub._id });
      }
      console.error('Push error:', err);
    });
  });

  await Promise.all(pushPromises);
  res.json({ message: 'Notifications sent' });
});

export { subscribe, sendNotification };
