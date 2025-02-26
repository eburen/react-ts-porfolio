import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reviewService } from '../../services/reviewService';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId: string, { rejectWithValue }) => {
    try {
      return await reviewService.getProductReviews(productId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createProductReview = createAsyncThunk(
  'reviews/createProductReview',
  async (reviewData: { productId: string; rating: number; comment: string }, { rejectWithValue }) => {
    try {
      return await reviewService.createReview(reviewData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

export const updateProductReview = createAsyncThunk(
  'reviews/updateProductReview',
  async (
    { reviewId, reviewData }: { reviewId: string; reviewData: Partial<{ rating: number; comment: string }> },
    { rejectWithValue }
  ) => {
    try {
      return await reviewService.updateReview(reviewId, reviewData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteProductReview = createAsyncThunk(
  'reviews/deleteProductReview',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(reviewId);
      return reviewId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewSuccess: (state) => {
      state.success = false;
    },
    clearReviewError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch product reviews
    builder.addCase(fetchProductReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
      state.loading = false;
      state.reviews = action.payload;
    });
    builder.addCase(fetchProductReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create product review
    builder.addCase(createProductReview.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createProductReview.fulfilled, (state, action: PayloadAction<Review>) => {
      state.loading = false;
      state.reviews.push(action.payload);
      state.success = true;
    });
    builder.addCase(createProductReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Update product review
    builder.addCase(updateProductReview.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateProductReview.fulfilled, (state, action: PayloadAction<Review>) => {
      state.loading = false;
      const index = state.reviews.findIndex(review => review._id === action.payload._id);
      if (index !== -1) {
        state.reviews[index] = action.payload;
      }
      state.success = true;
    });
    builder.addCase(updateProductReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Delete product review
    builder.addCase(deleteProductReview.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(deleteProductReview.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.reviews = state.reviews.filter(review => review._id !== action.payload);
      state.success = true;
    });
    builder.addCase(deleteProductReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { clearReviewSuccess, clearReviewError } = reviewSlice.actions;

export default reviewSlice.reducer; 