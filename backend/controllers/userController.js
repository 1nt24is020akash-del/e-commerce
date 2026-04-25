import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Coupon from '../models/couponModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Auth user & get token
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    // Create Welcome Coupon if it doesn't exist
    const welcomeCoupon = await Coupon.findOne({ code: 'WELCOME20' });
    if (!welcomeCoupon) {
      await Coupon.create({
        code: 'WELCOME20',
        discountPercentage: 20,
        isFirstUserOnly: true,
        isActive: true,
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year expiry
      });
    }

    // Send Welcome Email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to MERN E-Shop!',
        message: `
          <h1>Welcome, ${user.name}!</h1>
          <p>We're thrilled to have you join our community at <strong>MERN E-Shop</strong>.</p>
          <p>Explore our wide range of products from Fresh Groceries to the Latest Electronics.</p>
          <div style="background: #f4f4f4; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <h2>Your Welcome Gift</h2>
            <p>Use the coupon code below for <strong>20% OFF</strong> on your first order!</p>
            <h1 style="color: #6366f1; letter-spacing: 5px;">WELCOME20</h1>
          </div>
          <p>Happy Shopping!</p>
          <p>Best Regards,<br>The MERN E-Shop Team</p>
        `,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't throw error here to allow user registration to succeed
    }

    generateToken(res, user._id);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    generateToken(res, updatedUser._id);

    res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isAdmin: updatedUser.isAdmin });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();
    res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isAdmin: updatedUser.isAdmin });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser };
