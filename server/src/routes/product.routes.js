import { Router } from 'express';
import { createProduct } from '../controllers/product.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const productRouter = Router();

productRouter.post(
  '/create',
  protect,
  restrictTo('ADMIN'),
  upload.array('images', 4),
  createProduct,
);

export default productRouter;
