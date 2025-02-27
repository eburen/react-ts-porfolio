import { Request, Response } from 'express';
import Product from '../models/product.model';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    
    const category = req.query.category ? { category: req.query.category } : {};
    
    // Add filter for sale products if requested
    const saleFilter = req.query.sale === 'true' ? { onSale: true } : {};
    
    const count = await Product.countDocuments({ ...keyword, ...category, ...saleFilter });
    const products = await Product.find({ ...keyword, ...category, ...saleFilter })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    
    res.json({
      products,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, imageUrl, stock, isAvailable } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
      isAvailable,
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, imageUrl, stock, isAvailable } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.imageUrl = imageUrl || product.imageUrl;
    product.stock = stock !== undefined ? stock : product.stock;
    product.isAvailable = isAvailable !== undefined ? isAvailable : product.isAvailable;
    
    // If product is on sale, update the sale price based on the current price and sale percentage
    if (product.onSale && product.salePercentage) {
      product.salePrice = Number((product.price * (1 - product.salePercentage / 100)).toFixed(2));
    }
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply sale to a product
// @route   PUT /api/products/:id/sale
// @access  Private/Admin
export const applySaleToProduct = async (req: Request, res: Response) => {
  try {
    const { salePercentage } = req.body;
    
    if (salePercentage < 0 || salePercentage > 100) {
      return res.status(400).json({ message: 'Sale percentage must be between 0 and 100' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Calculate sale price
    const salePrice = Number((product.price * (1 - salePercentage / 100)).toFixed(2));
    
    // Update product
    product.onSale = salePercentage > 0;
    product.salePercentage = salePercentage;
    product.salePrice = salePercentage > 0 ? salePrice : null;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove sale from a product
// @route   DELETE /api/products/:id/sale
// @access  Private/Admin
export const removeSaleFromProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Remove sale
    product.onSale = false;
    product.salePercentage = 0;
    product.salePrice = null;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply sale to multiple products
// @route   POST /api/products/bulk-sale
// @access  Private/Admin
export const applyBulkSale = async (req: Request, res: Response) => {
  try {
    const { productIds, salePercentage } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Product IDs are required' });
    }
    
    if (salePercentage < 0 || salePercentage > 100) {
      return res.status(400).json({ message: 'Sale percentage must be between 0 and 100' });
    }
    
    const updatedProducts = [];
    
    for (const productId of productIds) {
      const product = await Product.findById(productId);
      
      if (product) {
        // Calculate sale price
        const salePrice = Number((product.price * (1 - salePercentage / 100)).toFixed(2));
        
        // Update product
        product.onSale = salePercentage > 0;
        product.salePercentage = salePercentage;
        product.salePrice = salePercentage > 0 ? salePrice : null;
        
        const updatedProduct = await product.save();
        updatedProducts.push(updatedProduct);
      }
    }
    
    res.json({
      message: `Sale applied to ${updatedProducts.length} products`,
      products: updatedProducts,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 