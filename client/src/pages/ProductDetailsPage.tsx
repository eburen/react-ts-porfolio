import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { fetchProductById, clearProductDetails } from '../store/slices/productSlice';
import { RootState, AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import ProductReviews from '../components/product/ProductReviews';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon, ArrowBack } from '@mui/icons-material';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { product, loading, error } = useSelector((state: RootState) => state.products);
  const [quantity, setQuantity] = useState(1);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isInWishlist = wishlistItems.some(item => item.product._id === id);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }

    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && product && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        _id: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        imageUrl: product.imageUrl,
        quantity: quantity,
        stock: product.stock
      }));
      // Show success message or navigate to cart
    }
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(id!));
    } else {
      dispatch(addToWishlist(id!));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!product) {
    return <Alert severity="info">Product not found.</Alert>;
  }

  return (
    <Container>
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ mb: 1 }}
        >
          Back to Products
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <MuiLink component={Link} to="/products" underline="hover" color="inherit">
            Products
          </MuiLink>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>

            {product.salePrice ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  ${product.salePrice.toFixed(2)}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
                <Box
                  sx={{
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
              </Box>
            ) : (
              <Typography variant="h5" color="primary" gutterBottom>
                ${product.price.toFixed(2)}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </Typography>
            </Box>

            {product.stock > 0 && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    label="Quantity"
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: product.stock } }}
                    value={quantity}
                    onChange={handleQuantityChange}
                    sx={{ width: '100px', mr: 2 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleAddToCart}
                    disabled={!product.isAvailable || product.stock <= 0}
                    sx={{ mr: 2 }}
                  >
                    Add to Cart
                  </Button>

                  <Tooltip title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
                    <Button
                      variant="outlined"
                      color={isInWishlist ? "primary" : "secondary"}
                      onClick={handleToggleWishlist}
                      startIcon={isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    >
                      {isInWishlist ? "In Wishlist" : "Wishlist"}
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2">
                Category: {product.category}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {id && <ProductReviews productId={id} />}
    </Container>
  );
};

export default ProductDetailsPage; 