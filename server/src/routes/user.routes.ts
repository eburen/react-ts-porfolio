import express from 'express';
import { protect, admin } from '../middleware/auth.middleware';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller';

const router = express.Router();

// Wishlist routes - these need to come before the parameterized routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

// User management routes
router.get('/', protect, admin, (req, res) => {
  res.json({ message: 'Get all users - to be implemented' });
});

router.get('/:id', protect, admin, (req, res) => {
  res.json({ message: 'Get user by ID - to be implemented' });
});

router.put('/:id', protect, admin, (req, res) => {
  res.json({ message: 'Update user - to be implemented' });
});

router.delete('/:id', protect, admin, (req, res) => {
  res.json({ message: 'Delete user - to be implemented' });
});

export default router; 