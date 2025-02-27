import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  CardActions,
  CardHeader
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { fetchProducts } from '../store/slices/productSlice';
import { RootState, AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, page, pages } = useSelector((state: RootState) => state.products);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, keyword: searchTerm, category }));
  }, [dispatch, currentPage, searchTerm, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    dispatch(fetchProducts({ page: 1, keyword: searchTerm, category }));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    dispatch(fetchProducts({ page: 1, category }));
  };

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      stock: product.stock
    }));
  };

  const handleToggleWishlist = (productId: string) => {
    const isInWishlist = wishlistItems.some(item => item.product._id === productId);

    if (isInWishlist) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(productId));
    }
  };

  const isProductInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product._id === productId);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>

      <Box sx={{ mb: 4 }}>
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
              onClick={() => dispatch(fetchProducts({ page: 1, keyword: searchTerm, category }))}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </Box>

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
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                    <IconButton
                      color={isProductInWishlist(product._id) ? "primary" : "default"}
                      onClick={() => handleToggleWishlist(product._id)}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                      }}
                      aria-label={isProductInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isProductInWishlist(product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Box>
                  {product.salePrice && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 1,
                        bgcolor: 'error.main',
                        color: 'white',
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                      }}
                    >
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </Box>
                  )}
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                      {product.salePrice ? (
                        <>
                          <Typography variant="h6" color="primary">
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
                        <Typography variant="h6" color="primary">
                          ${product.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      component={Link}
                      to={`/products/${product._id}`}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      disabled={!product.isAvailable || product.stock <= 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

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
    </Container>
  );
};

export default ProductsPage; 