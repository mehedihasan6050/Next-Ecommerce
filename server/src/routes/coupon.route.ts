import express from 'express';
import { authenticateJwt, isSeller } from '../middlewares/auth.middleware';
import {
  createCoupon,
  deleteCoupon,
  fetchAllCoupons,
  fetchAllCouponSeller,
} from '../controllers/coupon.controller';

const router = express.Router();

router.use(authenticateJwt);

router.get('/fetch-all-coupons', fetchAllCoupons);
router.get('/fetch-all-coupons-seller', isSeller, fetchAllCouponSeller);
router.post('/create-coupon', isSeller, createCoupon);
router.delete('/:id', isSeller, deleteCoupon);

export default router;
