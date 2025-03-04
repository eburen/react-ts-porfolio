import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    List,
    ListItem,
    ListItemText,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Card,
    CardMedia,
    CardContent,
} from '@mui/material';
import { format } from 'date-fns';
import OrderTracker from '../components/orders/OrderTracker';
import { getOrderById, cancelOrder, clearOrderSuccess } from '../store/slices/orderSlice';
import { RootState, AppDispatch } from '../store/store';

const OrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { currentOrder, loading, error, success } = useSelector((state: RootState) => state.orders);
    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else if (id) {
            dispatch(getOrderById(id));
        }
    }, [dispatch, navigate, userInfo, id]);

    useEffect(() => {
        if (success) {
            dispatch(clearOrderSuccess());
        }
    }, [success, dispatch]);

    const handleCancelOrder = () => {
        if (id) {
            dispatch(cancelOrder(id));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
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

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'completed':
                return 'success';
            case 'failed':
                return 'error';
            case 'refunded':
                return 'info';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ my: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!currentOrder) {
        return (
            <Alert severity="info" sx={{ my: 2 }}>
                Order not found
            </Alert>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Order Details
                </Typography>
                <Button variant="outlined" onClick={() => navigate('/orders')}>
                    Back to Orders
                </Button>
            </Box>

            {/* Order Tracker */}
            <OrderTracker
                status={currentOrder.status}
                createdAt={currentOrder.createdAt}
                paidAt={currentOrder.paidAt}
                deliveredAt={currentOrder.deliveredAt}
            />

            <Grid container spacing={3}>
                {/* Order Summary */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List disablePadding>
                            <ListItem disableGutters>
                                <ListItemText primary="Order ID" />
                                <Typography variant="body2">{currentOrder._id}</Typography>
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary="Date" />
                                <Typography variant="body2">{formatDate(currentOrder.createdAt)}</Typography>
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary="Status" />
                                <Chip
                                    label={currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                                    color={getStatusColor(currentOrder.status) as any}
                                    size="small"
                                />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary="Payment Status" />
                                <Chip
                                    label={currentOrder.paymentStatus.charAt(0).toUpperCase() + currentOrder.paymentStatus.slice(1)}
                                    color={getPaymentStatusColor(currentOrder.paymentStatus) as any}
                                    size="small"
                                />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary="Payment Method" />
                                <Typography variant="body2">{currentOrder.paymentMethod}</Typography>
                            </ListItem>
                            {currentOrder.paidAt && (
                                <ListItem disableGutters>
                                    <ListItemText primary="Paid On" />
                                    <Typography variant="body2">{formatDate(currentOrder.paidAt)}</Typography>
                                </ListItem>
                            )}
                            {currentOrder.deliveredAt && (
                                <ListItem disableGutters>
                                    <ListItemText primary="Delivered On" />
                                    <Typography variant="body2">{formatDate(currentOrder.deliveredAt)}</Typography>
                                </ListItem>
                            )}
                        </List>

                        {(currentOrder.status === 'pending' || currentOrder.status === 'processing') && (
                            <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleCancelOrder}
                            >
                                Cancel Order
                            </Button>
                        )}
                    </Paper>

                    {/* Shipping Address */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Shipping Address
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2" paragraph>
                            {currentOrder.shippingAddress.street}
                        </Typography>
                        <Typography variant="body2" paragraph>
                            {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state}{' '}
                            {currentOrder.shippingAddress.postalCode}
                        </Typography>
                        <Typography variant="body2">
                            {currentOrder.shippingAddress.country}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Order Items */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Items
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {currentOrder.items.map((item: any) => (
                            <Card key={item._id || item.product._id} sx={{ display: 'flex', mb: 2 }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 100, height: 100, objectFit: 'contain' }}
                                    image={item.product.imageUrl}
                                    alt={item.product.name}
                                />
                                <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                                    <Typography component="div" variant="h6">
                                        {item.product.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Qty: {item.quantity}
                                        </Typography>
                                        <Typography variant="body2">
                                            ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1">Subtotal</Typography>
                            <Typography variant="body1">${currentOrder.totalAmount.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1">Shipping</Typography>
                            <Typography variant="body1">Free</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1">Tax</Typography>
                            <Typography variant="body1">Included</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6">${currentOrder.totalAmount.toFixed(2)}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default OrderDetailsPage; 