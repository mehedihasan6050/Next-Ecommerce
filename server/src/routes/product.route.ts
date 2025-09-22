import expess from 'express';
import {
  authenticateJwt,
  isAdmin,
  isSeller,
} from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import {
  createProduct,
  deleteProduct,
  fetchAllProductsForSeller,
  getProductByID,
  updateProduct,
  getProductsForClient,
  fetchAllProductsForAdmin,
} from '../controllers/product.controller';

const router = expess.Router();

router.post(
  '/create-new-product',
  authenticateJwt,
  isSeller,
  upload.array('images', 5),
  createProduct
);

router.get(
  '/fetch-seller-products',
  authenticateJwt,
  fetchAllProductsForSeller
);

router.get(
  '/fetch-admin-products',
  authenticateJwt,
  isAdmin,
  fetchAllProductsForAdmin
);

router.get('/fetch-client-products', authenticateJwt, getProductsForClient);
router.get('/:id', authenticateJwt, getProductByID);
router.put('/:id', authenticateJwt, isSeller, updateProduct);
router.delete('/:id', authenticateJwt, isSeller, deleteProduct);

export default router;
