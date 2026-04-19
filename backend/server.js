import express from 'express';
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
import Product from './models/productModel.js';
import products from './data/products.js';
import User from './models/userModel.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/cleanup', async (req, res) => {
  try {
    // Delete everyone except Akkk
    await User.deleteMany({ email: { $ne: 'admin99@gmail.com' } });
    res.send({ message: 'All other users deleted successfully!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/config/razorpay', (req, res) => res.send({ clientId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get(/.*/, (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
