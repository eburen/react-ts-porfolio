import express from 'express';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// We'll implement these controllers later
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