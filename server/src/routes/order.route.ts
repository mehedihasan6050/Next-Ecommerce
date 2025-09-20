import express from 'express';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { createOrder, paymentIntent } from '../controllers/order.controller';

const router = express.Router();

router.use(authenticateJwt);

router.post('/create-order', createOrder);
router.post('/create-payment-intent', paymentIntent);

export default router;
