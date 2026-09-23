import { Router } from 'express';
import {
  createProduct,
  getProductBySlug,
  getProducts,
} from '../controllers/product.controller.js';
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

productRouter.get('/', getProducts);
productRouter.get('/:slug', getProductBySlug);

export default productRouter;
