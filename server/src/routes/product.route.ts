import expess from 'express';
import { authenticateJwt, isSuperAdmin } from '../middlewares/auth.middleware';
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
  isSuperAdmin,
  upload.array('images', 5),
  createProduct
);

router.get('/fetch-admin-products', authenticateJwt, fetchAllProductsForAdmin);

router.get('/fetch-client-products', authenticateJwt, getProductsForClient);
router.get('/:id', authenticateJwt, getProductByID);
router.put('/:id', authenticateJwt, isSuperAdmin, updateProduct);
router.delete('/:id', authenticateJwt, isSuperAdmin, deleteProduct);


export default router;
