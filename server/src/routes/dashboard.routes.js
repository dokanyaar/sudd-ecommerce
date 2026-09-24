import express from 'express';

import { getAdminDashboard } from '../controllers/dashboard.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const dashboardRouter = express.Router();

dashboardRouter.get(
  '/admin/overview',
  protect,
  restrictTo('ADMIN'),
  getAdminDashboard,
);

export default dashboardRouter;
