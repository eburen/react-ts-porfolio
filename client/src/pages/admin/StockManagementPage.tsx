import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Alert,
    IconButton,
    Divider,
    Card,
    CardContent,
    CardActions,
    InputAdornment
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Remove as RemoveIcon
} from '@mui/icons-material';
import api from '../../services/api';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: number;
    isAvailable: boolean;
}

const StockManagementPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [stockToAdd, setStockToAdd] = useState<number>(0);
    const [stockToRemove, setStockToRemove] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to fetch product');
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddStock = async () => {
        if (!product || stockToAdd <= 0) return;

        try {
            setSubmitting(true);
            setError(null);

            const updatedStock = product.stock + stockToAdd;
            await api.put(`/products/${id}`, { stock: updatedStock });

            // Update local state
            setProduct({
                ...product,
                stock: updatedStock
            });

            setSuccess(`Added ${stockToAdd} items to stock`);
            setStockToAdd(0);
            setSubmitting(false);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update stock');
            setSubmitting(false);
        }
    };

    const handleRemoveStock = async () => {
        if (!product || stockToRemove <= 0) return;

        if (stockToRemove > product.stock) {
            setError('Cannot remove more items than current stock');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const updatedStock = product.stock - stockToRemove;
            await api.put(`/products/${id}`, { stock: updatedStock });

            // Update local state
            setProduct({
                ...product,
                stock: updatedStock
            });

            setSuccess(`Removed ${stockToRemove} items from stock`);
            setStockToRemove(0);
            setSubmitting(false);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update stock');
            setSubmitting(false);
        }
    };

    const handleSetStock = async (newStock: number) => {
        if (!product || newStock < 0) return;

        try {
            setSubmitting(true);
            setError(null);

            await api.put(`/products/${id}`, { stock: newStock });

            // Update local state
            setProduct({
                ...product,
                stock: newStock
            });

            setSuccess(`Stock updated to ${newStock} items`);
            setSubmitting(false);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update stock');
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton
                    color="primary"
                    sx={{ mr: 1 }}
                    component={Link}
                    to="/admin/products"
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1">
                    Stock Management
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            ) : !product ? (
                <Alert severity="info">Product not found</Alert>
            ) : (
                <>
                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
                    )}

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <Box
                                    component="img"
                                    src={product.imageUrl}
                                    alt={product.name}
                                    sx={{
                                        width: '100%',
                                        height: 200,
                                        objectFit: 'contain',
                                        p: 2
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {product.description.substring(0, 100)}...
                                    </Typography>
                                    <Typography variant="body1" color="primary">
                                        ${product.price.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Category: {product.category}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h5" gutterBottom>
                                    Current Stock: <Box component="span" sx={{ fontWeight: 'bold', color: product.stock > 10 ? 'success.main' : product.stock > 0 ? 'warning.main' : 'error.main' }}>
                                        {product.stock} items
                                    </Box>
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="h6" gutterBottom>
                                    Update Stock
                                </Typography>

                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Set Exact Stock"
                                            type="number"
                                            value={product.stock}
                                            onChange={(e) => handleSetStock(Number(e.target.value))}
                                            InputProps={{
                                                inputProps: { min: 0 }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={() => { }}
                                            disabled={submitting}
                                            sx={{ height: '56px' }}
                                        >
                                            Set Stock
                                        </Button>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Add Stock
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    label="Quantity to Add"
                                                    type="number"
                                                    value={stockToAdd}
                                                    onChange={(e) => setStockToAdd(Number(e.target.value))}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AddIcon color="success" />
                                                            </InputAdornment>
                                                        ),
                                                        inputProps: { min: 0 }
                                                    }}
                                                    sx={{ mb: 2 }}
                                                />
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    fullWidth
                                                    onClick={handleAddStock}
                                                    disabled={stockToAdd <= 0 || submitting}
                                                >
                                                    Add to Stock
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Remove Stock
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    label="Quantity to Remove"
                                                    type="number"
                                                    value={stockToRemove}
                                                    onChange={(e) => setStockToRemove(Number(e.target.value))}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <RemoveIcon color="error" />
                                                            </InputAdornment>
                                                        ),
                                                        inputProps: { min: 0, max: product.stock }
                                                    }}
                                                    sx={{ mb: 2 }}
                                                />
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    fullWidth
                                                    onClick={handleRemoveStock}
                                                    disabled={stockToRemove <= 0 || stockToRemove > product.stock || submitting}
                                                >
                                                    Remove from Stock
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        to="/admin/products"
                                        sx={{ mr: 2 }}
                                    >
                                        Back to Products
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to={`/admin/products/edit/${product._id}`}
                                    >
                                        Edit Product
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default StockManagementPage; 