import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import Product from './models/productModel.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Coupon from './models/couponModel.js';
import coupons from './data/coupons.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/cleanup', async (req, res) => {
  try {
    // Delete everyone except Akkk
    await User.deleteMany({ email: { $ne: 'admin99@gmail.com' } });
    res.send({ message: 'All other users deleted successfully!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/seed-products', async (req, res) => {
  try {
    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }
    const snacksAndChats = products.filter(p => p.category === 'Snacks & Chats');
    const existingSnacks = await Product.find({ category: 'Snacks & Chats' });
    
    if (existingSnacks.length === 0) {
      const sampleProducts = snacksAndChats.map(p => ({ ...p, user: adminUser._id }));
      await Product.insertMany(sampleProducts);
      res.send({ message: 'Snacks & Chats products seeded successfully!' });
    } else {
      res.send({ message: 'Snacks & Chats products already exist.' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/seed-coupons', async (req, res) => {
  try {
    await Coupon.deleteMany();
    await Coupon.insertMany(coupons);
    res.send({ message: '10 Coupons seeded successfully!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/seed-all-products', async (req, res) => {
  try {
    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }
    
    // Delete existing products to avoid duplicates during seed
    await Product.deleteMany();
    
    const sampleProducts = products.map(p => ({ ...p, user: adminUser._id }));
    await Product.insertMany(sampleProducts);
    
    res.send({ message: 'All products seeded successfully!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/config/razorpay', (req, res) => res.send({ clientId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get(/.*/, (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
