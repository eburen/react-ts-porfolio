import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { fetchWishlist, removeFromWishlist, clearWishlistError } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { RootState, AppDispatch } from '../store';

const WishlistPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.wishlist);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearWishlistError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
      quantity: 1,
      stock: item.product.stock || 10, // Fallback if stock is not available
    }));
  };

  if (loading && (!items || items.length === 0)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Ensure items is an array
  const wishlistItems = Array.isArray(items) ? items : [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Wishlist
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {wishlistItems.length === 0 ? (
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Your wishlist is empty.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card>
                {item.product && item.product.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.product.imageUrl}
                    alt={item.product.name}
                  />
                )}
                <CardContent>
                  {item.product && (
                    <>
                      <Typography variant="h6" component="div" gutterBottom>
                        {item.product.name}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${item.product.price.toFixed(2)}
                      </Typography>
                    </>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Box>
                    {item.product && (
                      <>
                        <Button
                          size="small"
                          component={Link}
                          to={`/products/${item.product._id}`}
                        >
                          View Details
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          disabled={!item.product.isAvailable}
                          onClick={() => handleAddToCart(item)}
                          sx={{ ml: 1 }}
                        >
                          Add to Cart
                        </Button>
                      </>
                    )}
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => item.product && handleRemoveFromWishlist(item.product._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WishlistPage; 