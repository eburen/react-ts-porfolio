import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    TextField,
    IconButton,
    InputAdornment,
    Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { format } from 'date-fns';
import {
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    clearOrderSuccess,
} from '../../store/slices/orderSlice';
import { RootState, AppDispatch } from '../../store';
import { exportToCsv } from '../../utils/exportToCsv';

const OrderManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [newPaymentStatus, setNewPaymentStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState<any[]>([]);

    const { adminOrders, loading: ordersLoading, error, success } = useSelector((state: RootState) => state.orders);
    const { userInfo, isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!authLoading && isAuthenticated && userInfo?.role === 'admin') {
            dispatch(getAllOrders({ page, limit }));
        } else if (!authLoading && (!isAuthenticated || (userInfo && userInfo.role !== 'admin'))) {
            navigate('/login');
        }
    }, [dispatch, navigate, userInfo, isAuthenticated, authLoading, page, limit]);

    useEffect(() => {
        if (adminOrders && adminOrders.orders) {
            if (searchTerm.trim() === '') {
                setFilteredOrders(adminOrders.orders);
            } else {
                const filtered = adminOrders.orders.filter((order) =>
                    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (order.user && typeof order.user === 'object' &&
                        (order.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.user.email?.toLowerCase().includes(searchTerm.toLowerCase())))
                );
                setFilteredOrders(filtered);
            }
        }
    }, [adminOrders, searchTerm]);

    useEffect(() => {
        if (success) {
            dispatch(clearOrderSuccess());
            setOpenStatusDialog(false);
            setOpenPaymentDialog(false);
        }
    }, [success, dispatch]);

    if (authLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated || (userInfo && userInfo.role !== 'admin')) {
        return null;
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleOpenStatusDialog = (orderId: string, currentStatus: string) => {
        setSelectedOrderId(orderId);
        setNewStatus(currentStatus);
        setOpenStatusDialog(true);
    };

    const handleCloseStatusDialog = () => {
        setOpenStatusDialog(false);
    };

    const handleOpenPaymentDialog = (orderId: string, currentPaymentStatus: string) => {
        setSelectedOrderId(orderId);
        setNewPaymentStatus(currentPaymentStatus);
        setOpenPaymentDialog(true);
    };

    const handleClosePaymentDialog = () => {
        setOpenPaymentDialog(false);
    };

    const handleStatusChange = (event: SelectChangeEvent) => {
        setNewStatus(event.target.value);
    };

    const handlePaymentStatusChange = (event: SelectChangeEvent) => {
        setNewPaymentStatus(event.target.value);
    };

    const handleUpdateStatus = () => {
        if (selectedOrderId && newStatus) {
            dispatch(updateOrderStatus({ orderId: selectedOrderId, status: newStatus }));
        }
    };

    const handleUpdatePaymentStatus = () => {
        if (selectedOrderId && newPaymentStatus) {
            dispatch(updatePaymentStatus({ orderId: selectedOrderId, paymentStatus: newPaymentStatus }));
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
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

    const prepareOrdersForExport = (orders: any[]) => {
        return orders.map(order => {
            const userName = order.user && typeof order.user === 'object' ? order.user.name : 'Unknown';
            const userEmail = order.user && typeof order.user === 'object' ? order.user.email : 'Unknown';

            const address = order.shippingAddress ?
                `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}` :
                'No address';

            const orderDate = order.createdAt ? formatDate(order.createdAt) : 'Unknown';
            const paidDate = order.paidAt ? formatDate(order.paidAt) : 'Not paid';
            const deliveredDate = order.deliveredAt ? formatDate(order.deliveredAt) : 'Not delivered';

            return {
                OrderID: order._id,
                Date: orderDate,
                CustomerName: userName,
                CustomerEmail: userEmail,
                ShippingAddress: address,
                Status: order.status,
                PaymentStatus: order.paymentStatus,
                PaymentMethod: order.paymentMethod,
                PaidDate: paidDate,
                DeliveredDate: deliveredDate,
                TotalAmount: order.totalAmount.toFixed(2),
            };
        });
    };

    const handleExportOrders = () => {
        const exportData = prepareOrdersForExport(filteredOrders);
        exportToCsv(exportData, `orders-export-${format(new Date(), 'yyyy-MM-dd')}`);
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Order Management
                </Typography>
                <Tooltip title="Export Orders to CSV">
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExportOrders}
                        disabled={filteredOrders.length === 0}
                    >
                        Export to CSV
                    </Button>
                </Tooltip>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by order ID, customer name, or email"
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClearSearch} edge="end">
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {ordersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ my: 2 }}>
                    {error}
                </Alert>
            ) : filteredOrders.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1">No orders found</Typography>
                </Paper>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                    <TableCell sx={{ color: 'white' }}>Order ID</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Date</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Customer</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Total</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Payment</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order._id} hover>
                                        <TableCell>{order._id.substring(order._id.length - 8)}</TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                        <TableCell>
                                            {order.user && typeof order.user === 'object' ? (
                                                <>
                                                    <Typography variant="body2">{order.user.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {order.user.email}
                                                    </Typography>
                                                </>
                                            ) : (
                                                'User info not available'
                                            )}
                                        </TableCell>
                                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                color={getStatusColor(order.status) as any}
                                                size="small"
                                                onClick={() => handleOpenStatusDialog(order._id, order.status)}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                color={getPaymentStatusColor(order.paymentStatus) as any}
                                                size="small"
                                                onClick={() => handleOpenPaymentDialog(order._id, order.paymentStatus)}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => navigate(`/orders/${order._id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={adminOrders.pages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            )}

            {/* Update Order Status Dialog */}
            <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
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
                    <Button onClick={handleUpdateStatus} variant="contained" color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Payment Status Dialog */}
            <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog}>
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
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="failed">Failed</MenuItem>
                            <MenuItem value="refunded">Refunded</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePaymentDialog}>Cancel</Button>
                    <Button onClick={handleUpdatePaymentStatus} variant="contained" color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderManagementPage;