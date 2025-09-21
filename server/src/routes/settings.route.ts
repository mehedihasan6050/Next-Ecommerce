import express from 'express';
import { authenticateJwt, isAdmin } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import {
  addFeatureBanners,
  fetchFeatureBanners,
  getFeaturedProducts,
  updateFeaturedProducts,
} from '../controllers/settings.controller';

const router = express.Router();

router.post(
  '/banners',
  authenticateJwt,
  isAdmin,
  upload.array('images', 5),
  addFeatureBanners
);

router.get('/get-banners', authenticateJwt, fetchFeatureBanners);
router.post(
  '/update-feature-products',
  authenticateJwt,
  isAdmin,
  updateFeaturedProducts
);
router.get('/fetch-feature-products', authenticateJwt, getFeaturedProducts);

export default router;
