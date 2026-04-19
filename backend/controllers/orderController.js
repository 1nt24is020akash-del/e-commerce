import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({ ...x, product: x._id, _id: undefined })),
      user: req.user._id, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) { res.json(order); } else { res.status(404); throw new Error('Order not found'); }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder' || !process.env.RAZORPAY_KEY_ID) {
       order.isPaid = true;
       order.paidAt = Date.now();
       order.paymentResult = {
         id: razorpay_payment_id || 'mocked_id',
         status: 'COMPLETED',
         update_time: Date.now().toString(),
         email_address: req.user.email,
       };
       const updatedOrder = await order.save();
       return res.json(updatedOrder);
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'COMPLETED',
        update_time: Date.now().toString(),
        email_address: req.user.email,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(400);
      throw new Error('Invalid signature');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder' || !process.env.RAZORPAY_KEY_ID) {
      return res.json({ id: 'order_mock_' + order._id, amount: order.totalPrice * 100 });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(order.totalPrice * 100),
      currency: "INR",
      receipt: `receipt_order_${order._id}`,
    };

    const razorpayOrder = await instance.orders.create(options);
    res.json(razorpayOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered, createRazorpayOrder };
