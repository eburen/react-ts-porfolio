import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { RootState, AppDispatch } from '../../store';
import api from '../../services/api';

// Define our interfaces
interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressFormData {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const initialFormState: AddressFormData = {
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false
};

// The component with simplified state management
const AddressList: React.FC = () => {
  // Component state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [dataFetched, setDataFetched] = useState(false);

  // Load addresses only once when component mounts
  useEffect(() => {
    // Prevent duplicate fetches
    if (dataFetched) return;

    const fetchAddresses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/users/addresses');
        if (response.data && Array.isArray(response.data)) {
          setAddresses(response.data);
        } else {
          setAddresses([]);
          console.warn('Expected address data to be an array');
        }
      } catch (err: any) {
        console.error('Error fetching addresses:', err);
        setError(err.response?.data?.message || 'Failed to load addresses');
        setAddresses([]);
      } finally {
        setLoading(false);
        setDataFetched(true);
      }
    };

    fetchAddresses();
  }, [dataFetched]); // Only depend on dataFetched flag

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openAddDialog = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setFormData({
      _id: address._id,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  const closeNotification = () => {
    setNotification({
      ...notification,
      show: false
    });
  };

  // API calls for CRUD operations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && formData._id) {
        // Update existing address
        const response = await api.put(`/users/addresses/${formData._id}`, formData);

        // Update local state
        setAddresses(prev =>
          prev.map(addr => addr._id === formData._id ? response.data : addr)
        );
        showNotification('Address updated successfully', 'success');
      } else {
        // Add new address
        const response = await api.post('/users/addresses', formData);

        // Update local state
        setAddresses(prev => [...prev, response.data]);
        showNotification('Address added successfully', 'success');
      }

      closeDialog();
    } catch (err: any) {
      console.error('Error saving address:', err);
      setError(err.response?.data?.message || 'Failed to save address');
      showNotification('Failed to save address', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirm = (id: string) => {
    setAddressToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setAddressToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleDelete = async () => {
    if (!addressToDelete) return;

    setLoading(true);
    setError(null);

    try {
      await api.delete(`/users/addresses/${addressToDelete}`);

      // Update local state
      setAddresses(prev => prev.filter(addr => addr._id !== addressToDelete));
      showNotification('Address deleted successfully', 'success');
      closeDeleteConfirm();
    } catch (err: any) {
      console.error('Error deleting address:', err);
      setError(err.response?.data?.message || 'Failed to delete address');
      showNotification('Failed to delete address', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header with Add button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">My Addresses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
          disabled={loading}
        >
          Add New Address
        </Button>
      </Box>

      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Content section */}
      {loading && !addresses.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : addresses.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ my: 4, textAlign: 'center' }}>
          You don't have any saved addresses yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((address) => (
            <Grid item xs={12} md={6} key={address._id}>
              <Card variant="outlined">
                <CardContent>
                  {address.isDefault && (
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Default Address
                    </Typography>
                  )}
                  <Typography variant="body1">
                    {address.street}
                  </Typography>
                  <Typography variant="body1">
                    {address.city}, {address.state} {address.postalCode}
                  </Typography>
                  <Typography variant="body1">
                    {address.country}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => openEditDialog(address)}
                    disabled={loading}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => openDeleteConfirm(address._id)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Form Dialog */}
      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      name="isDefault"
                    />
                  }
                  label="Set as default address"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : (isEditing ? 'Save Changes' : 'Add Address')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={closeDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this address?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.show}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeNotification} severity={notification.type as 'success' | 'error'} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddressList; 