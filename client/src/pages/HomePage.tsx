import { useEffect } from 'react';
import { Typography, Box, Grid, Button, Container, Card, CardMedia, CardContent, CardActions, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import { RootState, AppDispatch } from '../store';
import SalesBanner from '../components/home/SalesBanner';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.products);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    // Fetch featured products (first page, limited number)
    dispatch(fetchProducts({ page: 1, limit: 4 }));
  }, [dispatch]);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
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
      <Box sx={{ mt: 4, mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Our E-Commerce Store
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Discover amazing products at great prices.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/products"
          sx={{ mt: 2 }}
        >
          Shop Now
        </Button>
      </Box>

      {/* Sales Banner Slider */}
      <SalesBanner />

      {products.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
            Featured Products
          </Typography>

          <Grid container spacing={3}>
            {products.slice(0, 4).map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={3}>
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
                    <Typography gutterBottom variant="h6" component="h3" noWrap>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              component={Link}
              to="/products"
            >
              View All Products
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default HomePage; 