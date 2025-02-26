import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch } from 'react-redux';

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

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Theme
import theme from './theme';

// Redux
import { AppDispatch } from './store';
import { fetchCurrentUser } from './store/slices/authSlice';

function App() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch]);

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

                        {/* Admin routes */}
                        <Route path="/admin" element={
                            <ProtectedRoute requireAdmin>
                                <div>Admin Dashboard (to be implemented)</div>
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