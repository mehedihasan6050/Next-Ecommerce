import express from 'express';

import {
  dashboardStatics,
  dashboardStatsForAdmin,
} from '../controllers/dashboard.controller';
import {
  authenticateJwt,
  isAdmin,
  isSeller,
} from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authenticateJwt);

router.get('/statistics-seller', isSeller, dashboardStatics);
router.get('/statistics-admin', isAdmin, dashboardStatsForAdmin);

export default router;
