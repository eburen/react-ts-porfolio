import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService';

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
  };
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      return await wishlistService.getWishlist();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      return await wishlistService.addToWishlist(productId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistSuccess: (state) => {
      state.success = false;
    },
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder.addCase(fetchWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add to wishlist
    builder.addCase(addToWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action: PayloadAction<WishlistItem>) => {
      state.loading = false;
      state.items.push(action.payload);
      state.success = true;
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Remove from wishlist
    builder.addCase(removeFromWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.items = state.items.filter(item => item.product._id !== action.payload);
      state.success = true;
    });
    builder.addCase(removeFromWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { clearWishlistSuccess, clearWishlistError } = wishlistSlice.actions;

export default wishlistSlice.reducer; 