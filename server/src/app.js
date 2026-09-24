import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';
import orderRouter from './routes/order.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

const app = express();

// global middlewares
app.use(morgan('dev'));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// api endpoints
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/dashboard', dashboardRouter);

app.get('/test', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API running...',
  });
});

export default app;
