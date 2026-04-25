import express from 'express';
import { getCouponByCode, createCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, createCoupon);
router.route('/:code').get(protect, getCouponByCode);

export default router;
