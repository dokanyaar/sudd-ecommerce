import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

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
app.get('/test', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API running...',
  });
});

export default app;
