import expess from 'express';
import { authenticateJwt, isAdmin } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import {
  createProduct,
  deleteProduct,
  fetchAllProductsForAdmin,
  getProductByID,
  updateProduct,
  getProductsForClient,
} from '../controllers/product.controller';

const router = expess.Router();

router.post(
  '/create-new-product',
  authenticateJwt,
  isAdmin,
  upload.array('images', 5),
  createProduct
);

router.get('/fetch-admin-products', authenticateJwt, fetchAllProductsForAdmin);

router.get('/fetch-client-products', authenticateJwt, getProductsForClient);
router.get('/:id', authenticateJwt, getProductByID);
router.put('/:id', authenticateJwt, isAdmin, updateProduct);
router.delete('/:id', authenticateJwt, isAdmin, deleteProduct);

export default router;
