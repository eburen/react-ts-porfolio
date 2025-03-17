import React, { useEffect, useState, useRef } from 'react';
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
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import {
  fetchUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress
} from '../../store/slices/userSlice';
import { RootState, AppDispatch } from '../../store';

interface AddressFormData {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const initialAddressForm: AddressFormData = {
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false,
};

const AddressList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, loading, error } = useSelector((state: RootState) => state.user);
  const hasLoadedRef = useRef(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormData>(initialAddressForm);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Fetch addresses only once when component mounts
  useEffect(() => {
    if (!hasLoadedRef.current) {
      dispatch(fetchUserAddresses());
      hasLoadedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array since we only want to fetch once on mount

  const handleOpenAddDialog = () => {
    setAddressForm(initialAddressForm);
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (address: any) => {
    setAddressForm({
      _id: address._id,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAddressForm(initialAddressForm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && addressForm._id) {
      dispatch(updateUserAddress({
        id: addressForm._id,
        address: {
          street: addressForm.street,
          city: addressForm.city,
          state: addressForm.state,
          postalCode: addressForm.postalCode,
          country: addressForm.country,
          isDefault: addressForm.isDefault,
        }
      }))
        .unwrap()
        .then(() => {
          handleCloseDialog();
        });
    } else {
      dispatch(addUserAddress({
        street: addressForm.street,
        city: addressForm.city,
        state: addressForm.state,
        postalCode: addressForm.postalCode,
        country: addressForm.country,
        isDefault: addressForm.isDefault,
      }))
        .unwrap()
        .then(() => {
          handleCloseDialog();
        });
    }
  };

  const handleOpenDeleteConfirm = (id: string) => {
    setAddressToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setAddressToDelete(null);
  };

  const handleDeleteAddress = () => {
    if (addressToDelete) {
      dispatch(deleteUserAddress(addressToDelete))
        .unwrap()
        .then(() => {
          handleCloseDeleteConfirm();
        });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">My Addresses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add New Address
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : !addresses || addresses.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ my: 4, textAlign: 'center' }}>
          You don't have any saved addresses yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {Array.isArray(addresses) && addresses.map((address) => (
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
                    onClick={() => handleOpenEditDialog(address)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteConfirm(address._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        <form onSubmit={handleSubmitAddress}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="street"
                  value={addressForm.street}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={addressForm.city}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={addressForm.state}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postalCode"
                  value={addressForm.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={addressForm.country}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={addressForm.isDefault}
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
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this address?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button onClick={handleDeleteAddress} color="error" variant="contained">
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressList; 