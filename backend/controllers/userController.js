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
    res.json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      isAdmin: user.isAdmin, 
      phone: user.phone 
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  console.log(`[Register] Request received for: ${email}`);
  
  console.log('[Register] Checking if user exists in DB...');
  const userExists = await User.findOne({ email });

  if (userExists) {
    console.log('[Register] User already exists');
    res.status(400);
    return res.json({ message: 'User already exists' });
  }

  console.log('[Register] Attempting to create user (triggers bcrypt hook)...');
  const user = await User.create({ name, email, password, phone });

  if (user) {
    console.log(`[Register] User created successfully: ${user._id}`);
    
    // Create Welcome Coupon if it doesn't exist
    try {
      console.log('[Register] Checking for Welcome Coupon...');
      const welcomeCoupon = await Coupon.findOne({ code: 'WELCOME20' });
      if (!welcomeCoupon) {
        console.log('[Register] Creating new WELCOME20 coupon...');
        await Coupon.create({
          code: 'WELCOME20',
          discountPercentage: 20,
          isFirstUserOnly: true,
          isActive: true,
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        });
      }
    } catch (couponErr) {
      console.error('[Register] Coupon operation failed (ignoring):', couponErr.message);
    }

    // Send Welcome Email (NON-BLOCKING)
    console.log('[Register] Triggering background welcome email...');
    sendEmail({
      email: user.email,
      subject: 'Welcome to MERN E-Shop!',
      message: `<h1>Welcome, ${user.name}!</h1><p>Happy Shopping!</p>`,
    }).catch(emailError => console.error('[Register] Email sending failed:', emailError));

    console.log('[Register] Sending final success response');
    generateToken(res, user._id);
    return res.status(201).json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      isAdmin: user.isAdmin, 
      phone: user.phone,
      success: true 
    });
  } else {
    console.log('[Register] User creation failed (returned null)');
    res.status(400);
    return res.json({ message: 'Invalid user data' });
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
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, phone: user.phone });
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
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    generateToken(res, updatedUser._id);

    res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isAdmin: updatedUser.isAdmin, phone: updatedUser.phone });
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
    user.phone = req.body.phone || user.phone;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();
    res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isAdmin: updatedUser.isAdmin, phone: updatedUser.phone });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Send broadcast email to all users
const sendEmailToUsers = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const users = await User.find({});

  if (users.length > 0) {
    for (const user of users) {
      try {
        await sendEmail({
          email: user.email,
          subject: subject,
          message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
              ${message}
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 0.8rem; color: #888; text-align: center;">You are receiving this email because you are a registered user of MERN E-Shop.</p>
            </div>
          `,
        });
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
      }
    }
    res.json({ message: 'Broadcast emails sent successfully!' });
  } else {
    res.status(404);
    throw new Error('No users found');
  }
});

// @desc    Auth user with Google
const googleAuth = asyncHandler(async (req, res) => {
  console.log('Google Auth request received:', req.body.email);
  const { name, email } = req.body;
  
  console.log('Finding user by email...');
  const user = await User.findOne({ email });

  if (user) {
    console.log('User found, generating token...');
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
    });
  } else {
    console.log('User not found, creating new user...');
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const newUser = await User.create({
      name,
      email,
      password: generatedPassword,
    });

    if (newUser) {
      console.log('New Google user created:', newUser._id);
      generateToken(res, newUser._id);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        phone: newUser.phone,
      });
    } else {
      console.log('Invalid Google user data');
      res.status(400);
      throw new Error('Invalid user data');
    }
  }
});

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser, sendEmailToUsers, googleAuth };
