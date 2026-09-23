import { Router } from 'express';

import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/auth.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const authRouter = Router();

// public routes
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);

// authenticated routes
authRouter.get('/me', protect, getMe);

export default authRouter;
