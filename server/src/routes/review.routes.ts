import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Routes for /api/products/:id/reviews
router.route('/products/:id/reviews')
  .get(getProductReviews)
  .post(protect, createReview);

// Routes for /api/reviews/:id
router.route('/reviews/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router; 