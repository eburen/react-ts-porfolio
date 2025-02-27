import React from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
    Inventory as InventoryIcon,
    LocalOffer as LocalOfferIcon,
    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
    Dashboard as DashboardIcon,
    Add as AddIcon
} from '@mui/icons-material';

const AdminDashboardPage: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Admin Dashboard
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    component={Link}
                    to="/admin/products/new"
                >
                    Add New Product
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Admin Features Cards */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <InventoryIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                                <Typography variant="h6">Product Management</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Add, edit, or remove products. Manage product inventory and details.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                component={Link}
                                to="/admin/products"
                                variant="outlined"
                                fullWidth
                            >
                                Manage Products
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocalOfferIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                                <Typography variant="h6">Sales Management</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Create and manage sales, discounts, and promotional offers.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                component={Link}
                                to="/admin/sales"
                                variant="outlined"
                                fullWidth
                            >
                                Manage Sales
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ShoppingCartIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                                <Typography variant="h6">Order Management</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body2" color="text.secondary" paragraph>
                                View and manage customer orders, track shipments, and process returns.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                component={Link}
                                to="/admin/orders"
                                variant="outlined"
                                fullWidth
                                disabled
                            >
                                Manage Orders
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Stats Cards */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    component={Link}
                                    to="/admin/products/new"
                                    startIcon={<AddIcon />}
                                >
                                    Add Product
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    component={Link}
                                    to="/admin/products/stock"
                                    startIcon={<InventoryIcon />}
                                >
                                    Update Stock
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    color="info"
                                    fullWidth
                                    component={Link}
                                    to="/admin/sales"
                                    startIcon={<LocalOfferIcon />}
                                >
                                    Manage Sales
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    fullWidth
                                    component={Link}
                                    to="/admin/users"
                                    startIcon={<PeopleIcon />}
                                    disabled
                                >
                                    Manage Users
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboardPage; 