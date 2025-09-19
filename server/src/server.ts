import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route';
import productRoutes from './routes/product.route';
import couponRoutes from './routes/coupon.route';
import settingsRoutes from './routes/settings.route'
import cartRoutes from './routes/cart.route'
import addressRoutes from './routes/address.route'

//load all your enviroment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

export const prisma = new PrismaClient();


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupon', couponRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);


app.get('/', (req, res) => {
  res.send('Hello from E-Commerce backend');
});

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
