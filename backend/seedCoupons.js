import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coupon from './models/couponModel.js';
import connectDB from './config/db.js';
import coupons from './data/coupons.js';

dotenv.config({ path: 'backend/.env' });
connectDB();

const importData = async () => {
  try {
    await Coupon.deleteMany();
    await Coupon.insertMany(coupons);
    console.log('Coupons Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
