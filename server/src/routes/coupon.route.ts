import express from 'express';
import { authenticateJwt, isAdmin } from '../middlewares/auth.middleware';
import {
  createCoupon,
  deleteCoupon,
  fetchAllCoupons,
} from '../controllers/coupon.controller';

const router = express.Router();

router.use(authenticateJwt);

router.get('/fetch-all-coupons', fetchAllCoupons);
router.post('/create-coupon', isAdmin, createCoupon);
router.delete('/:id', isAdmin, deleteCoupon);

export default router;
