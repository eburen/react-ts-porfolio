import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// Get cart from localStorage if available
const cartFromStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart') || '{}')
  : { items: [], totalItems: 0, totalAmount: 0 };

const initialState: CartState = cartFromStorage;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i._id === item._id);
      
      if (existingItem) {
        // If item already exists, update quantity
        existingItem.quantity += item.quantity;
        
        // Make sure quantity doesn't exceed stock
        if (existingItem.quantity > existingItem.stock) {
          existingItem.quantity = existingItem.stock;
        }
      } else {
        // Add new item to cart
        state.items.push(item);
      }
      
      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item._id !== id);
      
      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      
      if (item) {
        // Update quantity
        item.quantity = quantity;
        
        // Make sure quantity doesn't exceed stock
        if (item.quantity > item.stock) {
          item.quantity = item.stock;
        }
        
        // Make sure quantity is at least 1
        if (item.quantity < 1) {
          item.quantity = 1;
        }
      }
      
      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer; 