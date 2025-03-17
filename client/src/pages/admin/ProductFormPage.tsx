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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    CircularProgress,
    Alert,
    IconButton,
    InputAdornment,
    Switch,
    FormControlLabel,
    Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import api from '../../services/api';

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: number;
    isAvailable: boolean;
}

interface FormErrors {
    name?: string;
    description?: string;
    price?: string;
    category?: string;
    imageUrl?: string;
    stock?: string;
}

const initialFormData: ProductFormData = {
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    stock: 0,
    isAvailable: true
};

const ProductFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<ProductFormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const response = await api.get(`/products/${id}`);
                    const product = response.data;

                    setFormData({
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        category: product.category,
                        imageUrl: product.imageUrl,
                        stock: product.stock,
                        isAvailable: product.isAvailable
                    });

                    setLoading(false);
                } catch (error: any) {
                    setError(error.response?.data?.message || 'Failed to fetch product');
                    setLoading(false);
                }
            };

            fetchProduct();
        }
    }, [id, isEditMode]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Product description is required';
        }

        if (formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.imageUrl.trim()) {
            newErrors.imageUrl = 'Image URL is required';
        } else if (!isValidUrl(formData.imageUrl)) {
            newErrors.imageUrl = 'Please enter a valid URL';
        }

        if (formData.stock < 0) {
            newErrors.stock = 'Stock cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;

        if (name) {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        setFormData({
            ...formData,
            [name]: checked
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            if (isEditMode) {
                await api.put(`/products/${id}`, formData);
                setSuccess('Product updated successfully');
            } else {
                const response = await api.post('/products', formData);
                setSuccess('Product created successfully');
                // Reset form after successful creation
                setFormData(initialFormData);
            }

            setSubmitting(false);

            // Navigate back to product list after a short delay
            setTimeout(() => {
                navigate('/admin/products');
            }, 2000);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to save product');
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
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            ) : (
                <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
                    )}

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={!!errors.category} required>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    label="Category"
                                >
                                    <MenuItem value="">Select a category</MenuItem>
                                    <MenuItem value="electronics">Electronics</MenuItem>
                                    <MenuItem value="clothing">Clothing</MenuItem>
                                    <MenuItem value="books">Books</MenuItem>
                                    <MenuItem value="home">Home & Kitchen</MenuItem>
                                    <MenuItem value="beauty">Beauty & Personal Care</MenuItem>
                                </Select>
                                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                error={!!errors.description}
                                helperText={errors.description}
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                error={!!errors.price}
                                helperText={errors.price}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    inputProps: { min: 0, step: 0.01 }
                                }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                error={!!errors.stock}
                                helperText={errors.stock}
                                InputProps={{
                                    inputProps: { min: 0 }
                                }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Image URL"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                error={!!errors.imageUrl}
                                helperText={errors.imageUrl}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isAvailable}
                                        onChange={handleSwitchChange}
                                        name="isAvailable"
                                        color="primary"
                                    />
                                }
                                label="Product is available for purchase"
                            />
                        </Grid>

                        {formData.imageUrl && isValidUrl(formData.imageUrl) && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Image Preview:
                                </Typography>
                                <Box
                                    component="img"
                                    src={formData.imageUrl}
                                    alt="Product preview"
                                    sx={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                        border: '1px solid #ddd',
                                        borderRadius: 1,
                                        p: 1
                                    }}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    to="/admin/products"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={submitting}
                                    startIcon={submitting ? <CircularProgress size={20} /> : null}
                                >
                                    {isEditMode ? 'Update Product' : 'Create Product'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Container>
    );
};

export default ProductFormPage; 