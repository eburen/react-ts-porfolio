import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions,
    Button,
    Divider,
    Avatar,
    CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
    Inventory as InventoryIcon,
    LocalOffer as LocalOfferIcon,
    People as PeopleIcon,
    Dashboard as DashboardIcon,
    Add as AddIcon,
    ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { RootState } from '../../store';
import OrderStatistics from '../../components/admin/OrderStatistics';

const AdminDashboardPage: React.FC = () => {
    const { userInfo, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Only redirect if we're sure authentication is complete (not loading)
        // and either the user is not authenticated or not an admin
        if (!loading && (!isAuthenticated || (userInfo && userInfo.role !== 'admin'))) {
            navigate('/login');
        }
    }, [userInfo, isAuthenticated, loading, navigate]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Don't render anything if not authenticated or not admin
    if (!isAuthenticated || (userInfo && userInfo.role !== 'admin')) {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Admin Dashboard
            </Typography>

            {/* Order Statistics */}
            <OrderStatistics />

            <Grid container spacing={3}>
                {/* Product Management Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <InventoryIcon />
                                </Avatar>
                                <Typography variant="h6" component="div">
                                    Product Management
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Manage your product catalog, add new products, update existing ones, and control inventory.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                component={Link}
                                to="/admin/products"
                                startIcon={<InventoryIcon />}
                            >
                                Manage Products
                            </Button>
                            <Button
                                size="small"
                                color="secondary"
                                component={Link}
                                to="/admin/products/new"
                                startIcon={<AddIcon />}
                            >
                                Add Product
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Sales Management Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                    <LocalOfferIcon />
                                </Avatar>
                                <Typography variant="h6" component="div">
                                    Sales Management
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Create and manage sales promotions, discounts, and special offers for your products.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                component={Link}
                                to="/admin/sales"
                                startIcon={<LocalOfferIcon />}
                            >
                                Manage Sales
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Order Management Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                    <ShoppingBagIcon />
                                </Avatar>
                                <Typography variant="h6" component="div">
                                    Order Management
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Manage customer orders, update order status, and handle payment processing.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                component={Link}
                                to="/admin/orders"
                                startIcon={<ShoppingBagIcon />}
                            >
                                Manage Orders
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboardPage; 