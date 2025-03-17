import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';

// Admin Pages
import SalesManagementPage from './pages/admin/SalesManagementPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import StockManagementPage from './pages/admin/StockManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Theme
import theme from './theme';

// Redux
import { AppDispatch, RootState } from './store';
import { fetchCurrentUser } from './store/slices/authSlice';

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    const { loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const checkAuth = async () => {
            if (localStorage.getItem('token')) {
                await dispatch(fetchCurrentUser());
            }
            setInitialCheckDone(true);
        };

        checkAuth();
    }, [dispatch]);

    // Show loading spinner during initial authentication check
    if (!initialCheckDone || loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Product routes */}
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailsPage />} />

                        {/* Protected routes */}
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />

                        {/* Order routes */}
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <OrderHistoryPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/orders/:id"
                            element={
                                <ProtectedRoute>
                                    <OrderDetailsPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin routes */}
                        <Route path="/admin" element={
                            <ProtectedRoute requireAdmin>
                                <AdminDashboardPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/products" element={
                            <ProtectedRoute requireAdmin>
                                <ProductManagementPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/products/new" element={
                            <ProtectedRoute requireAdmin>
                                <ProductFormPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/products/edit/:id" element={
                            <ProtectedRoute requireAdmin>
                                <ProductFormPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/products/stock/:id" element={
                            <ProtectedRoute requireAdmin>
                                <StockManagementPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/sales" element={
                            <ProtectedRoute requireAdmin>
                                <SalesManagementPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/orders" element={
                            <ProtectedRoute requireAdmin>
                                <OrderManagementPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/orders/:id" element={
                            <ProtectedRoute requireAdmin>
                                <OrderDetailsPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/cart" element={<CartPage />} />

                        <Route path="/wishlist" element={
                            <ProtectedRoute>
                                <WishlistPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/checkout" element={
                            <ProtectedRoute>
                                <CheckoutPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/order-confirmation/:orderId" element={
                            <ProtectedRoute>
                                <OrderConfirmationPage />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
}

export default App; 