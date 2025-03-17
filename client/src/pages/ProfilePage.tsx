import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { fetchUserProfile, clearUserError, clearUserSuccess } from '../store/slices/userSlice';
import ProfileInfo from '../components/profile/ProfileInfo';
import AddressList from '../components/profile/AddressList';
import OrderHistory from '../components/profile/OrderHistory';
import { Receipt as ReceiptIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, loading, error, success } = useSelector((state: RootState) => state.user);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearUserError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearUserSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully!</Alert>}

      <Paper elevation={3} sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Personal Information" />
            <Tab label="Addresses" />
            <Tab label="Orders" icon={<ReceiptIcon />} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <ProfileInfo profile={profile} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <AddressList />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Your Orders</Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/orders"
                startIcon={<ReceiptIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/orders';
                }}
              >
                View All Orders
              </Button>
            </Box>
            <Typography variant="body1">
              View and manage your order history, track shipments, and request returns.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProfilePage; 