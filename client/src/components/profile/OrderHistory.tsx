import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Button, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Grid, 
  Divider 
} from '@mui/material';
import { 
  fetchUserOrders, 
  fetchOrderDetails, 
  clearCurrentOrder 
} from '../../store/slices/userSlice';
import { RootState, AppDispatch } from '../../store';

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

const OrderHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, currentOrder, loading } = useSelector((state: RootState) => state.user);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleViewOrderDetails = (orderId: string) => {
    dispatch(fetchOrderDetails(orderId))
      .unwrap()
      .then(() => {
        setOrderDetailsOpen(true);
      });
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setTimeout(() => {
      dispatch(clearCurrentOrder());
    }, 300);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order History
      </Typography>

      {loading && orders.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ my: 4, textAlign: 'center' }}>
          You haven't placed any orders yet.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      onClick={() => handleViewOrderDetails(order._id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Details Dialog */}
      <Dialog 
        open={orderDetailsOpen} 
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : currentOrder ? (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Order Number</Typography>
                  <Typography variant="body1" gutterBottom>{currentOrder.orderNumber}</Typography>
                  
                  <Typography variant="subtitle2">Date Placed</Typography>
                  <Typography variant="body1" gutterBottom>{formatDate(currentOrder.createdAt)}</Typography>
                  
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip 
                    label={currentOrder.status} 
                    color={getStatusColor(currentOrder.status) as any}
                    size="small"
                    sx={{ my: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Shipping Address</Typography>
                  {currentOrder.shippingAddress ? (
                    <>
                      <Typography variant="body1">{currentOrder.shippingAddress.street}</Typography>
                      <Typography variant="body1">
                        {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postalCode}
                      </Typography>
                      <Typography variant="body1" gutterBottom>{currentOrder.shippingAddress.country}</Typography>
                    </>
                  ) : (
                    <Typography variant="body1" gutterBottom>Not available</Typography>
                  )}
                  
                  <Typography variant="subtitle2">Payment Method</Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentOrder.paymentMethod || 'Not available'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>Order Items</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentOrder.items.map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {item.product.imageUrl && (
                              <Box
                                component="img"
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                sx={{ width: 50, height: 50, mr: 2, objectFit: 'cover' }}
                              />
                            )}
                            <Typography variant="body2">{item.product.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ mr: 4 }}>Subtotal:</Typography>
                    <Typography variant="body1">${currentOrder.totalAmount.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ mr: 4 }}>Shipping:</Typography>
                    <Typography variant="body1">Free</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ mr: 4 }}>Total:</Typography>
                    <Typography variant="h6">${currentOrder.totalAmount.toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography>Order details not available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderHistory; 