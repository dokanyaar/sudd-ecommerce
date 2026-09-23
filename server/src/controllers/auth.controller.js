import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import { sendToken } from '../utils/jwt.js';

// register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return sendToken({
      user,
      statusCode: 201,
      res,
      message: 'Account created successfully.',
    });
  } catch (error) {
    console.error('Register error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    return sendToken({
      user,
      statusCode: 200,
      res,
      message: 'Logged in successfully.',
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

// logout user
export const logoutUser = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    };

    res.clearCookie('token', cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    console.error('Logout error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

// get current user
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
