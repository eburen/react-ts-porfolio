import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';
import { CartItem } from './cartSlice';

interface Order {
  _id: string;
  user: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      imageUrl: string;
    };
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  currentOrder: Order | null;
  orders: Order[];
  adminOrders: {
    orders: Order[];
    page: number;
    pages: number;
    total: number;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderState = {
  currentOrder: null,
  orders: [],
  adminOrders: {
    orders: [],
    page: 1,
    pages: 1,
    total: 0
  },
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      return await orderService.createOrder(orderData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(orderId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('getUserOrders thunk - making API call');
      const response = await orderService.getUserOrders();
      console.log('getUserOrders thunk - API response:', response);
      return response;
    } catch (error: any) {
      console.error('getUserOrders thunk - error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await orderService.cancelOrder(orderId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

// Admin thunks
export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await orderService.getAllOrders(page, limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: string }, { rejectWithValue }) => {
    try {
      return await orderService.updateOrderStatus(orderId, status);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'orders/updatePaymentStatus',
  async ({ orderId, paymentStatus }: { orderId: string; paymentStatus: string }, { rejectWithValue }) => {
    try {
      return await orderService.updatePaymentStatus(orderId, paymentStatus);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update payment status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrderSuccess: (state) => {
      state.success = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Create order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.currentOrder = action.payload;
      state.success = true;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Get order by ID
    builder.addCase(getOrderById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.currentOrder = action.payload;
    });
    builder.addCase(getOrderById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get user orders
    builder.addCase(getUserOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(getUserOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Cancel order
    builder.addCase(cancelOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(cancelOrder.fulfilled, (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.orders = state.orders.map(order => 
        order._id === action.payload._id ? action.payload : order
      );
      if (state.currentOrder && state.currentOrder._id === action.payload._id) {
        state.currentOrder = action.payload;
      }
      state.success = true;
    });
    builder.addCase(cancelOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Admin: Get all orders
    builder.addCase(getAllOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllOrders.fulfilled, (state, action: PayloadAction<{
      orders: Order[];
      page: number;
      pages: number;
      total: number;
    }>) => {
      state.loading = false;
      state.adminOrders = action.payload;
    });
    builder.addCase(getAllOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Admin: Update order status
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.adminOrders.orders = state.adminOrders.orders.map(order => 
        order._id === action.payload._id ? action.payload : order
      );
      if (state.currentOrder && state.currentOrder._id === action.payload._id) {
        state.currentOrder = action.payload;
      }
      state.success = true;
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Admin: Update payment status
    builder.addCase(updatePaymentStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePaymentStatus.fulfilled, (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.adminOrders.orders = state.adminOrders.orders.map(order => 
        order._id === action.payload._id ? action.payload : order
      );
      if (state.currentOrder && state.currentOrder._id === action.payload._id) {
        state.currentOrder = action.payload;
      }
      state.success = true;
    });
    builder.addCase(updatePaymentStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearOrderError, clearOrderSuccess, clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer; 