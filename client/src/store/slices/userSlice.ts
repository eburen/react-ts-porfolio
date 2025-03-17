import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';

interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: any[];
}

interface UserState {
  profile: any;
  addresses: Address[];
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserState = {
  profile: null,
  addresses: [],
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getProfile();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: any, { rejectWithValue }) => {
    try {
      return await userService.updateProfile(userData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const fetchUserAddresses = createAsyncThunk(
  'user/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const result = await userService.getAddresses();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

export const addUserAddress = createAsyncThunk(
  'user/addAddress',
  async (address: any, { rejectWithValue }) => {
    try {
      return await userService.addAddress(address);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add address');
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  'user/updateAddress',
  async ({ id, address }: { id: string; address: any }, { rejectWithValue }) => {
    try {
      return await userService.updateAddress(id, address);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update address');
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  'user/deleteAddress',
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.deleteAddress(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'user/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getOrders();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'user/fetchOrderDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      return await userService.getOrderDetails(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUserSuccess: (state) => {
      state.success = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update user profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.profile = action.payload;
      state.success = true;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Fetch user addresses
    builder.addCase(fetchUserAddresses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
      state.loading = false;
      state.addresses = action.payload;
    });
    builder.addCase(fetchUserAddresses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add user address
    builder.addCase(addUserAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(addUserAddress.fulfilled, (state, action: PayloadAction<Address>) => {
      state.loading = false;
      state.addresses.push(action.payload);
      state.success = true;
    });
    builder.addCase(addUserAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Update user address
    builder.addCase(updateUserAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateUserAddress.fulfilled, (state, action: PayloadAction<Address>) => {
      state.loading = false;
      const index = state.addresses.findIndex(addr => addr._id === action.payload._id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
      state.success = true;
    });
    builder.addCase(updateUserAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Delete user address
    builder.addCase(deleteUserAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(deleteUserAddress.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
      state.success = true;
    });
    builder.addCase(deleteUserAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Fetch user orders
    builder.addCase(fetchUserOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchUserOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch order details
    builder.addCase(fetchOrderDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderDetails.fulfilled, (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.currentOrder = action.payload;
    });
    builder.addCase(fetchOrderDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearUserError, clearUserSuccess, clearCurrentOrder } = userSlice.actions;

export default userSlice.reducer; 