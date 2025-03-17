import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { getOrderById, clearCurrentOrder } from '../store/slices/orderSlice';
import { RootState, AppDispatch } from '../store';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
    
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderId]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!currentOrder) {
    return <Alert severity="info">Order not found.</Alert>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Order Confirmed!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Thank you for your purchase. Your order has been received and is being processed.
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Order #{currentOrder._id.substring(currentOrder._id.length - 8)}
          </Typography>
          <Chip 
            label={currentOrder.status} 
            color={getStatusColor(currentOrder.status) as any}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Placed on {formatDate(currentOrder.createdAt)}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Items
        </Typography>
        
        {currentOrder.items.map((item: any) => (
          <Box key={item._id} sx={{ display: 'flex', mb: 2 }}>
            <Box sx={{ width: 80, height: 80, mr: 2 }}>
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">{item.product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Quantity: {item.quantity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${item.price.toFixed(2)} each
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        ))}
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Typography variant="body1">
              {currentOrder.shippingAddress.street}
            </Typography>
            <Typography variant="body1">
              {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postalCode}
            </Typography>
            <Typography variant="body1">
              {currentOrder.shippingAddress.country}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            <Typography variant="body1">
              Method: {currentOrder.paymentInfo.paymentMethod}
            </Typography>
            {currentOrder.paymentInfo.cardNumber && (
              <Typography variant="body1">
                Card: **** **** **** {currentOrder.paymentInfo.cardNumber.slice(-4)}
              </Typography>
            )}
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Typography variant="body1" sx={{ mr: 4 }}>Subtotal:</Typography>
            <Typography variant="body1">${currentOrder.totalAmount.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Typography variant="body1" sx={{ mr: 4 }}>Shipping:</Typography>
            <Typography variant="body1">Free</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Typography variant="body1" sx={{ mr: 4 }}>Tax:</Typography>
            <Typography variant="body1">${(currentOrder.totalAmount * 0.1).toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="h6" sx={{ mr: 4 }}>Total:</Typography>
            <Typography variant="h6">${(currentOrder.totalAmount * 1.1).toFixed(2)}</Typography>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button component={Link} to="/products" variant="outlined">
          Continue Shopping
        </Button>
        <Button component={Link} to="/profile" variant="contained">
          View My Orders
        </Button>
      </Box>
    </Container>
  );
};

export default OrderConfirmationPage; 