import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';
import Order from '../models/orderModel.js';

const getCouponByCode = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code, isActive: true });

  if (coupon) {
    if (new Date() > new Date(coupon.expiryDate)) {
      res.status(400);
      throw new Error('Coupon has expired');
    }

    if (coupon.isFirstUserOnly) {
      if (!req.user) {
        res.status(401);
        throw new Error('Please login to use this coupon');
      }
      const orderCount = await Order.countDocuments({ user: req.user._id });
      if (orderCount > 0) {
        res.status(400);
        throw new Error('This coupon is only valid for your first order');
      }
    }

    res.json(coupon);
  } else {
    res.status(404);
    throw new Error('Invalid coupon code');
  }
});

const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountPercentage, expiryDate } = req.body;
  
  const couponExists = await Coupon.findOne({ code });
  if (couponExists) {
    res.status(400);
    throw new Error('Coupon already exists');
  }

  const coupon = await Coupon.create({ code, discountPercentage, expiryDate });
  if (coupon) {
    res.status(201).json(coupon);
  } else {
    res.status(400);
    throw new Error('Invalid coupon data');
  }
});

export { getCouponByCode, createCoupon };
