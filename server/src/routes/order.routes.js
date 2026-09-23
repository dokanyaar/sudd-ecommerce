import { Router } from 'express';

import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/order.controller.js';

import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const orderRouter = Router();

// Admin routes
orderRouter.get('/admin/all', protect, restrictTo('ADMIN'), getAllOrders);

orderRouter.patch(
  '/admin/:orderId/status',
  protect,
  restrictTo('ADMIN'),
  updateOrderStatus,
);

// Customer routes
orderRouter.post('/', protect, createOrder);

orderRouter.get('/', protect, getMyOrders);

orderRouter.get('/:orderId', protect, getOrderById);

export default orderRouter;
