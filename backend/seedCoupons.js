import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coupon from './models/couponModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Coupon.deleteMany();
    await Coupon.create({
      code: 'TEST20',
      discountPercentage: 20,
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });
    console.log('Coupons Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
