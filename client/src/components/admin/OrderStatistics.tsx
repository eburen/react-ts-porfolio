import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Divider,
    Paper,
} from '@mui/material';
import {
    ShoppingBag as ShoppingBagIcon,
    LocalShipping as ShippingIcon,
    CheckCircle as DeliveredIcon,
    Cancel as CancelledIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../store/store';
import { getAllOrders } from '../../store/slices/orderSlice';

const OrderStatistics: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { adminOrders, loading } = useSelector((state: RootState) => state.orders);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        revenue: 0,
    });

    useEffect(() => {
        dispatch(getAllOrders({ page: 1, limit: 100 }));
    }, [dispatch]);

    useEffect(() => {
        if (adminOrders && adminOrders.orders) {
            const newStats = {
                total: adminOrders.orders.length,
                pending: 0,
                processing: 0,
                shipped: 0,
                delivered: 0,
                cancelled: 0,
                revenue: 0,
            };

            adminOrders.orders.forEach((order) => {
                // Count by status
                switch (order.status) {
                    case 'pending':
                        newStats.pending++;
                        break;
                    case 'processing':
                        newStats.processing++;
                        break;
                    case 'shipped':
                        newStats.shipped++;
                        break;
                    case 'delivered':
                        newStats.delivered++;
                        break;
                    case 'cancelled':
                        newStats.cancelled++;
                        break;
                    default:
                        break;
                }

                // Calculate revenue (only count completed orders)
                if (order.status !== 'cancelled' && order.paymentStatus === 'completed') {
                    newStats.revenue += order.totalAmount;
                }
            });

            setStats(newStats);
        }
    }, [adminOrders]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Order Statistics
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                {/* Total Orders */}
                <Grid item xs={6} sm={4} md={2}>
                    <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ShoppingBagIcon sx={{ mr: 1 }} />
                                <Typography variant="subtitle2">Total</Typography>
                            </Box>
                            <Typography variant="h4">{stats.total}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pending Orders */}
                <Grid item xs={6} sm={4} md={2}>
                    <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ShoppingBagIcon sx={{ mr: 1 }} />
                                <Typography variant="subtitle2">Pending</Typography>
                            </Box>
                            <Typography variant="h4">{stats.pending}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Processing Orders */}
                <Grid item xs={6} sm={4} md={2}>
                    <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ShoppingBagIcon sx={{ mr: 1 }} />
                                <Typography variant="subtitle2">Processing</Typography>
                            </Box>
                            <Typography variant="h4">{stats.processing}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Shipped Orders */}
                <Grid item xs={6} sm={4} md={2}>
                    <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ShippingIcon sx={{ mr: 1 }} />
                                <Typography variant="subtitle2">Shipped</Typography>
                            </Box>
                            <Typography variant="h4">{stats.shipped}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Delivered Orders */}
                <Grid item xs={6} sm={4} md={2}>
                    <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <DeliveredIcon sx={{ mr: 1 }} />
                                <Typography variant="subtitle2">Delivered</Typography>
                            </Box>
                            <Typography variant="h4">{stats.delivered}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Cancelled Orders */}
                <Grid item xs={6} sm={4} md={2}>
                    <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CancelledIcon sx={{ mr: 1 }} />
                                <Typography variant="subtitle2">Cancelled</Typography>
                            </Box>
                            <Typography variant="h4">{stats.cancelled}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Revenue */}
                <Grid item xs={12}>
                    <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Typography variant="subtitle2">Total Revenue (Completed Orders)</Typography>
                            <Typography variant="h4">${stats.revenue.toFixed(2)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default OrderStatistics; 