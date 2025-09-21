import express from 'express';
import { authenticateJwt, isAdmin } from '../middlewares/auth.middleware';
import {
  createOrder,
  paymentIntent,
  getOrder,
  getOrdersByUserId,
  getAllOrdersForAdmin,
  updateOrderStatus,
} from '../controllers/order.controller';

const router = express.Router();

router.use(authenticateJwt);

router.post('/create-order', createOrder);
router.post('/create-payment-intent', paymentIntent);
router.get('/get-single-order/:orderId', getOrder);
router.get('/get-order-by-user-id', getOrdersByUserId);
router.get('/get-all-orders-for-admin', isAdmin, getAllOrdersForAdmin);
router.put('/:orderId/status', isAdmin, updateOrderStatus);

export default router;
