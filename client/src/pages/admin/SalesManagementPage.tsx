import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar,
    IconButton,
    Chip,
    Divider,
    CircularProgress,
    InputAdornment,
} from '@mui/material';
import {
    Search as SearchIcon,
    Delete as DeleteIcon,
    LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { fetchProducts } from '../../store/slices/productSlice';
import { RootState, AppDispatch } from '../../store';
import api from '../../services/api';

const SalesManagementPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading } = useSelector((state: RootState) => state.products);

    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [salePercentage, setSalePercentage] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isApplyingSale, setIsApplyingSale] = useState(false);
    const [isRemovingSale, setIsRemovingSale] = useState(false);

    useEffect(() => {
        dispatch(fetchProducts({ page: 1, pageSize: 100 })); // Load all products for admin
    }, [dispatch]);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedProducts(products.map(product => product._id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (productId: string) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const handleApplySale = async () => {
        if (selectedProducts.length === 0) {
            setErrorMessage('Please select at least one product');
            return;
        }

        if (salePercentage <= 0 || salePercentage > 99) {
            setErrorMessage('Sale percentage must be between 1 and 99');
            return;
        }

        try {
            setIsApplyingSale(true);

            if (selectedProducts.length === 1) {
                // Apply to single product
                await api.put(`/products/${selectedProducts[0]}/sale`, { salePercentage });
            } else {
                // Apply to multiple products
                await api.post('/products/bulk-sale', {
                    productIds: selectedProducts,
                    salePercentage,
                });
            }

            // Refresh products
            dispatch(fetchProducts({ page: 1, pageSize: 100 }));
            setSuccessMessage(`Sale of ${salePercentage}% applied to ${selectedProducts.length} product(s)`);
            setSelectedProducts([]);
            setSalePercentage(0);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to apply sale');
        } finally {
            setIsApplyingSale(false);
        }
    };

    const handleRemoveSale = async (productId: string) => {
        try {
            setIsRemovingSale(true);
            await api.delete(`/products/${productId}/sale`);

            // Refresh products
            dispatch(fetchProducts({ page: 1, pageSize: 100 }));
            setSuccessMessage('Sale removed successfully');
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to remove sale');
        } finally {
            setIsRemovingSale(false);
        }
    };

    const handleRemoveAllSales = async () => {
        if (selectedProducts.length === 0) {
            setErrorMessage('Please select at least one product');
            return;
        }

        try {
            setIsRemovingSale(true);

            // Remove sale from each selected product
            for (const productId of selectedProducts) {
                await api.delete(`/products/${productId}/sale`);
            }

            // Refresh products
            dispatch(fetchProducts({ page: 1, pageSize: 100 }));
            setSuccessMessage(`Sales removed from ${selectedProducts.length} product(s)`);
            setSelectedProducts([]);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to remove sales');
        } finally {
            setIsRemovingSale(false);
        }
    };

    const handleSearch = () => {
        dispatch(fetchProducts({ page: 1, pageSize: 100, keyword: searchTerm, category }));
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = searchTerm === '' ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = category === '' || product.category === category;

        return matchesSearch && matchesCategory;
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Sales Management
            </Typography>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
            >
                <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
            >
                <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Apply Sale to Products
                        </Typography>

                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={3}>
                                <TextField
                                    label="Sale Percentage"
                                    type="number"
                                    fullWidth
                                    value={salePercentage}
                                    onChange={(e) => setSalePercentage(Number(e.target.value))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        inputProps: { min: 0, max: 99 }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleApplySale}
                                    disabled={isApplyingSale || selectedProducts.length === 0}
                                    startIcon={isApplyingSale ? <CircularProgress size={20} /> : <LocalOfferIcon />}
                                >
                                    Apply Sale
                                </Button>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    onClick={handleRemoveAllSales}
                                    disabled={isRemovingSale || selectedProducts.length === 0}
                                    startIcon={isRemovingSale ? <CircularProgress size={20} /> : <DeleteIcon />}
                                >
                                    Remove Sales
                                </Button>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedProducts.length} product(s) selected
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Products
                            </Typography>

                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={5}>
                                    <TextField
                                        label="Search Products"
                                        fullWidth
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <FormControl fullWidth>
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value as string)}
                                            label="Category"
                                        >
                                            <MenuItem value="">All Categories</MenuItem>
                                            <MenuItem value="electronics">Electronics</MenuItem>
                                            <MenuItem value="clothing">Clothing</MenuItem>
                                            <MenuItem value="books">Books</MenuItem>
                                            <MenuItem value="home">Home & Kitchen</MenuItem>
                                            <MenuItem value="beauty">Beauty & Personal Care</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={2}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleSearch}
                                    >
                                        Filter
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                                                    checked={products.length > 0 && selectedProducts.length === products.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </TableCell>
                                            <TableCell>Product</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell align="right">Regular Price</TableCell>
                                            <TableCell align="right">Sale Price</TableCell>
                                            <TableCell align="right">Discount</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredProducts.map((product) => (
                                            <TableRow key={product._id}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedProducts.includes(product._id)}
                                                        onChange={() => handleSelectProduct(product._id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box
                                                            component="img"
                                                            src={product.imageUrl}
                                                            alt={product.name}
                                                            sx={{ width: 50, height: 50, mr: 2, objectFit: 'cover' }}
                                                        />
                                                        <Box>
                                                            <Typography variant="body1">{product.name}</Typography>
                                                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                                                                {product.description}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                                                <TableCell align="right">
                                                    {product.onSale && product.salePrice
                                                        ? `$${product.salePrice.toFixed(2)}`
                                                        : '-'}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {product.onSale && product.salePercentage ? (
                                                        <Chip
                                                            label={`${product.salePercentage}% OFF`}
                                                            color="error"
                                                            size="small"
                                                        />
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {product.onSale ? (
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleRemoveSale(product._id)}
                                                            disabled={isRemovingSale}
                                                            size="small"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    ) : null}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SalesManagementPage; 