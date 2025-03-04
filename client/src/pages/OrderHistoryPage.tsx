import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { format } from 'date-fns';
import { getUserOrders, cancelOrder, clearOrderSuccess } from '../store/slices/orderSlice';
import { RootState, AppDispatch } from '../store/store';

const OrderHistoryPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);

    const { orders, loading, error, success } = useSelector((state: RootState) => state.orders);
    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            dispatch(getUserOrders());
        }
    }, [dispatch, navigate, userInfo]);

    useEffect(() => {
        if (success) {
            dispatch(clearOrderSuccess());
            setOpenCancelDialog(false);
        }
    }, [success, dispatch]);

    const handleOpenCancelDialog = (orderId: string) => {
        setCancelOrderId(orderId);
        setOpenCancelDialog(true);
    };

    const handleCloseCancelDialog = () => {
        setOpenCancelDialog(false);
        setCancelOrderId(null);
    };

    const handleCancelOrder = () => {
        if (cancelOrderId) {
            dispatch(cancelOrder(cancelOrderId));
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

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Order History
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ my: 2 }}>
                    {error}
                </Alert>
            ) : orders.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" gutterBottom>
                        You haven't placed any orders yet.
                    </Typography>
                    <Button
                        component={Link}
                        to="/products"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Start Shopping
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white' }}>Order ID</TableCell>
                                <TableCell sx={{ color: 'white' }}>Date</TableCell>
                                <TableCell sx={{ color: 'white' }}>Total</TableCell>
                                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                                <TableCell sx={{ color: 'white' }}>Payment</TableCell>
                                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id} hover>
                                    <TableCell>{order._id.substring(order._id.length - 8)}</TableCell>
                                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            color={getStatusColor(order.status) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                            color={getPaymentStatusColor(order.paymentStatus) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                component={Link}
                                                to={`/orders/${order._id}`}
                                            >
                                                Details
                                            </Button>
                                            {(order.status === 'pending' || order.status === 'processing') && (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleOpenCancelDialog(order._id)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Cancel Order Dialog */}
            <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
                <DialogTitle>Cancel Order</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancelDialog}>No, Keep Order</Button>
                    <Button onClick={handleCancelOrder} color="error" autoFocus>
                        Yes, Cancel Order
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderHistoryPage; 