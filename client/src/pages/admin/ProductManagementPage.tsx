import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    InputAdornment,
    Grid,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    ArrowBack as ArrowBackIcon,
    Inventory as InventoryIcon
} from '@mui/icons-material';
import { fetchProducts } from '../../store/slices/productSlice';
import { RootState, AppDispatch } from '../../store';
import api from '../../services/api';

const ProductManagementPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { products, loading, error, page, pages } = useSelector((state: RootState) => state.products);

    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        dispatch(fetchProducts({ page: currentPage, pageSize: 10, keyword: searchTerm, category }));
    }, [dispatch, currentPage, searchTerm, category]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        dispatch(fetchProducts({ page: 1, pageSize: 10, keyword: searchTerm, category }));
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
        dispatch(fetchProducts({ page: 1, pageSize: 10, category }));
    };

    const handleCategoryChange = (e: any) => {
        setCategory(e.target.value);
        setCurrentPage(1);
        dispatch(fetchProducts({ page: 1, pageSize: 10, keyword: searchTerm, category: e.target.value }));
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const openDeleteDialog = (productId: string) => {
        setProductToDelete(productId);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;

        try {
            setIsDeleting(true);
            await api.delete(`/products/${productToDelete}`);

            // Refresh products
            dispatch(fetchProducts({ page: currentPage, pageSize: 10, keyword: searchTerm, category }));
            setSuccessMessage('Product deleted successfully');
            closeDeleteDialog();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to delete product');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="primary"
                        sx={{ mr: 1 }}
                        component={Link}
                        to="/admin"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1">
                        Product Management
                    </Typography>
                </Box>
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

            <Paper sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box component="form" onSubmit={handleSearch}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="category-select-label">Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                id="category-select"
                                value={category}
                                onChange={handleCategoryChange}
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
                            fullWidth
                            variant="contained"
                            onClick={handleSearch}
                        >
                            Filter
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : products.length === 0 ? (
                <Alert severity="info">No products found.</Alert>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Stock</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>
                                            <Box
                                                component="img"
                                                src={product.imageUrl}
                                                alt={product.name}
                                                sx={{ width: 50, height: 50, objectFit: 'cover' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{product.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                                                {product.description.substring(0, 60)}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell align="right">
                                            {product.onSale && product.salePrice ? (
                                                <>
                                                    <Typography variant="body2" color="error.main">
                                                        ${product.salePrice.toFixed(2)}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ textDecoration: 'line-through' }}
                                                    >
                                                        ${product.price.toFixed(2)}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Typography variant="body2">
                                                    ${product.price.toFixed(2)}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                variant="body2"
                                                color={product.stock > 10 ? 'success.main' : product.stock > 0 ? 'warning.main' : 'error.main'}
                                            >
                                                {product.stock}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            {product.isAvailable ? (
                                                <Chip label="Available" color="success" size="small" />
                                            ) : (
                                                <Chip label="Unavailable" color="error" size="small" />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => navigate(`/admin/products/stock/${product._id}`)}
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                >
                                                    <InventoryIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => openDeleteDialog(product._id)}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={pages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this product? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteProduct}
                        color="error"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={20} /> : null}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductManagementPage; 