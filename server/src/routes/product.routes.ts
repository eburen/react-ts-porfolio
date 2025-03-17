import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  applySaleToProduct,
  removeSaleFromProduct,
  applyBulkSale,
} from '../controllers/product.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// Sale routes
router.put('/:id/sale', protect, admin, applySaleToProduct);
router.delete('/:id/sale', protect, admin, removeSaleFromProduct);
router.post('/bulk-sale', protect, admin, applyBulkSale);

export default router; 