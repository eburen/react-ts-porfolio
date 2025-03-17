import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  LocalOffer as LocalOfferIcon,
  Receipt as ReceiptIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAdminMenuAnchorEl(event.currentTarget);
    setAnchorEl(null);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
    setAdminMenuAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/login');
  };

  // Modify the handleNavigateToOrders function to use React Router's navigation properly
  const handleNavigateToOrders = () => {
    // Close the menu first
    handleMenuClose();
    // Use the navigate function from useNavigate hook
    // The replace:true ensures the current page is replaced in history
    navigate('/orders', { replace: true });

    // Add a small delay to ensure the component remounts properly
    setTimeout(() => {
      // Dispatch a custom event to force the OrderHistoryPage to reload data
      window.dispatchEvent(new CustomEvent('order-history-reload'));
    }, 100);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              flexGrow: 1
            }}
          >
            E-Commerce Store
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/products">
              Products
            </Button>

            {isAuthenticated ? (
              <>
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/cart"
                >
                  <Badge badgeContent={totalItems} color="secondary">
                    <CartIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/wishlist"
                  sx={{ ml: 1 }}
                >
                  <FavoriteIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/wishlist" onClick={handleMenuClose}>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Wishlist</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleNavigateToOrders}
          sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
        >
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Orders</ListItemText>
        </MenuItem>
        {user?.role === 'admin' && (
          <MenuItem onClick={handleAdminMenuOpen}>
            <ListItemIcon>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Admin</ListItemText>
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Admin Menu */}
      <Menu
        anchorEl={adminMenuAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(adminMenuAnchorEl)}
        onClose={handleAdminMenuClose}
      >
        <MenuItem component={Link} to="/admin" onClick={handleAdminMenuClose}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/admin/products" onClick={handleAdminMenuClose}>
          <ListItemIcon>
            <InventoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Products</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/admin/sales" onClick={handleAdminMenuClose}>
          <ListItemIcon>
            <LocalOfferIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sales</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/admin/orders" onClick={handleAdminMenuClose}>
          <ListItemIcon>
            <ShoppingBagIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Orders</ListItemText>
        </MenuItem>
      </Menu>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/'); }}>
          Home
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/products'); }}>
          Products
        </MenuItem>

        {isAuthenticated ? (
          <>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/cart'); }}>
              <Badge badgeContent={totalItems} color="secondary" sx={{ mr: 1 }}>
                <CartIcon />
              </Badge>
              Cart
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/wishlist'); }}>
              <FavoriteIcon sx={{ mr: 1 }} /> Wishlist
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
              <PersonIcon sx={{ mr: 1 }} /> Profile
            </MenuItem>
            {user?.role === 'admin' && (
              <>
                <Divider />
                <MenuItem onClick={() => { handleMenuClose(); navigate('/admin'); }}>
                  <DashboardIcon sx={{ mr: 1 }} /> Admin Dashboard
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/products'); }}>
                  <InventoryIcon sx={{ mr: 1 }} /> Manage Products
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/sales'); }}>
                  <LocalOfferIcon sx={{ mr: 1 }} /> Manage Sales
                </MenuItem>
              </>
            )}
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/login'); }}>
              Login
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/register'); }}>
              Register
            </MenuItem>
          </>
        )}
      </Menu>

      <Container component="main" sx={{ py: 4 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200]
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} E-Commerce Store
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default Layout; 