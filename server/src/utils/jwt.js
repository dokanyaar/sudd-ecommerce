import jwt from 'jsonwebtoken';

// sign token
export const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// send token
export const sendToken = ({ user, statusCode, res, message }) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };

  res.cookie('token', token, cookieOptions);

  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return res.status(statusCode).json({
    success: true,
    message,
    user: safeUser,
  });
};
