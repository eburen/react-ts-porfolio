import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  onSale: boolean;
  salePercentage?: number;
  category: string;
  imageUrl: string;
  stock: number;
  isAvailable: boolean;
}

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    salePrice: {
      type: Number,
      min: [0, 'Sale price cannot be negative'],
      default: null,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    salePercentage: {
      type: Number,
      min: [0, 'Sale percentage cannot be negative'],
      max: [100, 'Sale percentage cannot exceed 100'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>('Product', productSchema); 