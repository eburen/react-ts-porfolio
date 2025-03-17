import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { format } from 'date-fns';
import OrderTracker from '../components/orders/OrderTracker';
import api from '../services/api';

// Define interface for order items
interface OrderItem {
    product: {
        _id: string;
        name: string;
        price: number;
        imageUrl: string;
    };
    quantity: number;
    price: number;
}

// Define interface for order
interface Order {
    _id: string;
    user: any;
    items: OrderItem[];
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

const OrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we're in admin mode based on URL path
    const isAdminMode = location.pathname.includes('/admin/orders');

    // Local state
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });
    const [dataFetched, setDataFetched] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    // Admin state
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [paymentStatusDialogOpen, setPaymentStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [newPaymentStatus, setNewPaymentStatus] = useState('');

    // Fetch order details once
    useEffect(() => {
        if (!id || dataFetched) return;

        const fetchOrderDetails = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Check user role
                try {
                    const userResponse = await api.get('/users/profile');
                    setUserRole(userResponse.data.role);
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                }

                // Fetch order details
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data);
            } catch (err: any) {
                console.error('Error fetching order details:', err);
                setError(err.response?.data?.message || 'Failed to load order details');
            } finally {
                setLoading(false);
                setDataFetched(true);
            }
        };

        fetchOrderDetails();
    }, [id, navigate, dataFetched]);

    // Handle cancel order
    const handleCancelOrder = async () => {
        if (!id) return;

        setLoading(true);
        try {
            await api.put(`/orders/${id}/cancel`);

            // Update local state
            if (order) {
                setOrder({
                    ...order,
                    status: 'cancelled'
                });
            }

            showNotification('Order cancelled successfully', 'success');
        } catch (err: any) {
            console.error('Error cancelling order:', err);
            showNotification('Failed to cancel order', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Admin functions
    const handleOpenStatusDialog = () => {
        if (order) {
            setNewStatus(order.status);
            setStatusDialogOpen(true);
        }
    };

    const handleCloseStatusDialog = () => {
        setStatusDialogOpen(false);
    };

    const handleStatusChange = (e: SelectChangeEvent<string>) => {
        setNewStatus(e.target.value);
    };

    const handleUpdateStatus = async () => {
        if (!id || !newStatus) return;

        setLoading(true);
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });

            // Update local state
            if (order) {
                setOrder({
                    ...order,
                    status: newStatus
                });
            }

            showNotification('Order status updated successfully', 'success');
            setStatusDialogOpen(false);
        } catch (err: any) {
            console.error('Error updating order status:', err);
            showNotification('Failed to update order status', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPaymentStatusDialog = () => {
        if (order) {
            setNewPaymentStatus(order.paymentStatus);
            setPaymentStatusDialogOpen(true);
        }
    };

    const handleClosePaymentStatusDialog = () => {
        setPaymentStatusDialogOpen(false);
    };

    const handlePaymentStatusChange = (e: SelectChangeEvent<string>) => {
        setNewPaymentStatus(e.target.value);
    };

    const handleUpdatePaymentStatus = async () => {
        if (!id || !newPaymentStatus) return;

        setLoading(true);
        try {
            await api.put(`/orders/${id}/payment`, { paymentStatus: newPaymentStatus });

            // Update local state
            if (order) {
                setOrder({
                    ...order,
                    paymentStatus: newPaymentStatus
                });
            }

            showNotification('Payment status updated successfully', 'success');
            setPaymentStatusDialogOpen(false);
        } catch (err: any) {
            console.error('Error updating payment status:', err);
            showNotification('Failed to update payment status', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Helper for showing notifications
    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({
            open: true,
            message,
            type
        });
    };

    // Close notification
    const handleCloseNotification = () => {
        setNotification({
            ...notification,
            open: false
        });
    };

    // Helper functions for UI
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

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'error';
            case 'refunded':
                return 'info';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'PPP');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    if (loading && !order) {
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

    if (!order) {
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
                    {isAdminMode ? 'Manage Order' : 'Order Details'}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate(isAdminMode ? '/admin/orders' : '/orders')}
                >
                    Back to {isAdminMode ? 'All Orders' : 'My Orders'}
                </Button>
            </Box>

            {/* Order Tracker */}
            <OrderTracker
                status={order.status}
                createdAt={order.createdAt}
                paidAt={order.paidAt}
                deliveredAt={order.deliveredAt}
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
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemText primary="Order ID" />
                                <Typography variant="body2" color="text.secondary">
                                    {order._id}
                                </Typography>
                            </ListItem>
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemText primary="Date" />
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(order.createdAt)}
                                </Typography>
                            </ListItem>
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemText primary="Total" />
                                <Typography variant="body2" color="text.primary" fontWeight={600}>
                                    ${order.totalAmount.toFixed(2)}
                                </Typography>
                            </ListItem>
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemText primary="Status" />
                                {isAdminMode ? (
                                    <Chip
                                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        color={getStatusColor(order.status) as any}
                                        size="small"
                                        onClick={handleOpenStatusDialog}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <Chip
                                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        color={getStatusColor(order.status) as any}
                                        size="small"
                                    />
                                )}
                            </ListItem>
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemText primary="Payment" />
                                {isAdminMode ? (
                                    <Chip
                                        label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                        color={getPaymentStatusColor(order.paymentStatus) as any}
                                        size="small"
                                        onClick={handleOpenPaymentStatusDialog}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <Chip
                                        label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                        color={getPaymentStatusColor(order.paymentStatus) as any}
                                        size="small"
                                    />
                                )}
                            </ListItem>
                            {isAdminMode && order.user && (
                                <ListItem disablePadding sx={{ py: 1 }}>
                                    <ListItemText primary="Customer" />
                                    <Typography variant="body2" color="text.secondary">
                                        {order.user.name || 'N/A'}
                                    </Typography>
                                </ListItem>
                            )}
                        </List>

                        {/* Show action buttons based on role and order status */}
                        {!isAdminMode && order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleCancelOrder}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Cancel Order'}
                            </Button>
                        )}
                    </Paper>

                    {/* Shipping Information */}
                    <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
                        <Typography variant="h6" gutterBottom>
                            Shipping Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" paragraph>
                            {order.shippingAddress.street}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {order.shippingAddress.country}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                            Payment Method
                        </Typography>
                        <Typography variant="body1">
                            {order.paymentMethod}
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

                        {order.items.map((item) => (
                            <Card key={item.product._id} sx={{ display: 'flex', mb: 2, boxShadow: 'none', border: '1px solid #eee' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 100, height: 100, objectFit: 'contain' }}
                                    image={item.product.imageUrl}
                                    alt={item.product.name}
                                />
                                <CardContent sx={{ flex: '1 0 auto', py: 1 }}>
                                    <Grid container>
                                        <Grid item xs={12} sm={8}>
                                            <Typography variant="subtitle1" component="div">
                                                {item.product.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Quantity: {item.quantity}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { sm: 'flex-end' }, mt: { xs: 1, sm: 0 } }}>
                                            <Typography variant="subtitle1" component="div">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Subtotal: ${order.totalAmount.toFixed(2)}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Shipping: $0.00
                            </Typography>
                            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                                Total: ${order.totalAmount.toFixed(2)}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Admin Dialogs */}
            {isAdminMode && (
                <>
                    {/* Update Order Status Dialog */}
                    <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
                        <DialogTitle>Update Order Status</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="status-select-label">Status</InputLabel>
                                <Select
                                    labelId="status-select-label"
                                    value={newStatus}
                                    label="Status"
                                    onChange={handleStatusChange}
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="processing">Processing</MenuItem>
                                    <MenuItem value="shipped">Shipped</MenuItem>
                                    <MenuItem value="delivered">Delivered</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseStatusDialog}>Cancel</Button>
                            <Button onClick={handleUpdateStatus} variant="contained" color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Update'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Update Payment Status Dialog */}
                    <Dialog open={paymentStatusDialogOpen} onClose={handleClosePaymentStatusDialog}>
                        <DialogTitle>Update Payment Status</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="payment-status-select-label">Payment Status</InputLabel>
                                <Select
                                    labelId="payment-status-select-label"
                                    value={newPaymentStatus}
                                    label="Payment Status"
                                    onChange={handlePaymentStatusChange}
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="paid">Paid</MenuItem>
                                    <MenuItem value="failed">Failed</MenuItem>
                                    <MenuItem value="refunded">Refunded</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClosePaymentStatusDialog}>Cancel</Button>
                            <Button onClick={handleUpdatePaymentStatus} variant="contained" color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Update'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.type} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OrderDetailsPage; 