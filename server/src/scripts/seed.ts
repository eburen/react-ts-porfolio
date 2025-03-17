import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/user.model';
import Product from '../models/product.model';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    seedData();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    console.log('Admin user created:', adminUser.email);

    // Create products
    const products = [
      // Electronics
      {
        name: 'iPhone 15 Pro',
        description: 'Latest Apple iPhone with A17 Pro chip, 48MP camera, and titanium design.',
        price: 999.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484bce71',
        stock: 50,
        isAvailable: true,
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Flagship Android phone with Snapdragon 8 Gen 3, 200MP camera, and S Pen.',
        price: 1199.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1707227156456-e5490c56f5af',
        stock: 45,
        isAvailable: true,
      },
      {
        name: 'MacBook Pro 16"',
        description: 'Powerful laptop with M3 Pro/Max chip, Liquid Retina XDR display, and up to 40 hours of battery life.',
        price: 2499.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        stock: 30,
        isAvailable: true,
      },
      
      // Clothing
      {
        name: 'Premium Cotton T-Shirt',
        description: 'Soft, breathable 100% organic cotton t-shirt in various colors.',
        price: 24.99,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        stock: 100,
        isAvailable: true,
      },
      {
        name: 'Slim Fit Jeans',
        description: 'Classic denim jeans with modern slim fit and stretch comfort.',
        price: 59.99,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
        stock: 80,
        isAvailable: true,
      },
      {
        name: 'Winter Parka Jacket',
        description: 'Warm, waterproof jacket with faux fur hood and multiple pockets.',
        price: 149.99,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3',
        stock: 40,
        isAvailable: true,
      },
      
      // Home & Kitchen
      {
        name: 'Smart Coffee Maker',
        description: 'Wi-Fi enabled coffee maker with programmable brewing and app control.',
        price: 129.99,
        category: 'Home & Kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1517914309068-f000ec0f2d61',
        stock: 25,
        isAvailable: true,
      },
      {
        name: 'Non-Stick Cookware Set',
        description: '10-piece aluminum cookware set with ceramic non-stick coating.',
        price: 89.99,
        category: 'Home & Kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1584990347449-a5d9f800a783',
        stock: 35,
        isAvailable: true,
      },
      {
        name: 'Robot Vacuum Cleaner',
        description: 'Smart robot vacuum with mapping technology, app control, and self-emptying base.',
        price: 349.99,
        category: 'Home & Kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73',
        stock: 20,
        isAvailable: true,
      },
      
      // Books
      {
        name: 'The Midnight Library',
        description: 'Bestselling novel by Matt Haig about the choices that make up a life.',
        price: 14.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
        stock: 60,
        isAvailable: true,
      },
      {
        name: 'Atomic Habits',
        description: "James Clear's guide to building good habits and breaking bad ones.",
        price: 16.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
        stock: 55,
        isAvailable: true,
      },
      {
        name: 'The Psychology of Money',
        description: "Morgan Housel's timeless lessons on wealth, greed, and happiness.",
        price: 19.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
        stock: 45,
        isAvailable: true,
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);

    console.log('Data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}; 