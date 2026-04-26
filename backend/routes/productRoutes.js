import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
  createProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/delete-multiple').post(protect, admin, deleteProducts);
router.route('/bulk-create').post(protect, admin, createProducts);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
