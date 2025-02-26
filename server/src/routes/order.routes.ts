import express from 'express';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// We'll implement these controllers later
router.post('/', protect, (req, res) => {
  res.json({ message: 'Create order - to be implemented' });
});

router.get('/', protect, (req, res) => {
  res.json({ message: 'Get user orders - to be implemented' });
});

router.get('/all', protect, admin, (req, res) => {
  res.json({ message: 'Get all orders (admin) - to be implemented' });
});

router.get('/:id', protect, (req, res) => {
  res.json({ message: 'Get order by ID - to be implemented' });
});

router.put('/:id/pay', protect, (req, res) => {
  res.json({ message: 'Update order to paid - to be implemented' });
});

router.put('/:id/deliver', protect, admin, (req, res) => {
  res.json({ message: 'Update order to delivered - to be implemented' });
});

export default router; 