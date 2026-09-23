import { Router } from 'express';

import {
  createProduct,
  deleteProductByAdmin,
  getProductById,
  getProductBySlug,
  getProducts,
  getProductsByAdmin,
  updateProductByAdmin,
} from '../controllers/product.controller.js';

import upload from '../middlewares/multer.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const productRouter = Router();

// public routes
productRouter.get('/', getProducts);

productRouter.get('/:slug', getProductBySlug);

// admin routes
productRouter.get(
  '/admin/products',
  protect,
  restrictTo('ADMIN'),
  getProductsByAdmin,
);

productRouter.get(
  '/admin/products/:id',
  protect,
  restrictTo('ADMIN'),
  getProductById,
);

productRouter.post(
  '/admin/products',
  protect,
  restrictTo('ADMIN'),
  upload.array('images', 4),
  createProduct,
);

productRouter.patch(
  '/admin/products/:id',
  protect,
  restrictTo('ADMIN'),
  upload.array('images', 4),
  updateProductByAdmin,
);

productRouter.delete(
  '/admin/products/:id',
  protect,
  restrictTo('ADMIN'),
  deleteProductByAdmin,
);

export default productRouter;
