import { Request, Response } from 'express';
import Wishlist from '../models/wishlist.model';
import Product from '../models/product.model';

// Get user's wishlist
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user._id })
      .populate({
        path: 'product',
        select: 'name price imageUrl isAvailable stock',
      });

    res.json(wishlistItems);
  } catch (error: any) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add product to wishlist
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    // Populate product details for response
    const populatedItem = await Wishlist.findById(wishlistItem._id).populate({
      path: 'product',
      select: 'name price imageUrl isAvailable stock',
    });

    res.status(201).json(populatedItem);
  } catch (error: any) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    const wishlistItem = await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: productId,
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    res.json({ message: 'Product removed from wishlist' });
  } catch (error: any) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 