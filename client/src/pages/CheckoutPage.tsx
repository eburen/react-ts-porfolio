import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Divider,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import { RootState, AppDispatch } from '../store';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { fetchUserAddresses } from '../store/slices/userSlice';

const steps = ['Shipping Information', 'Payment Details', 'Review Order'];

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const { addresses } = useSelector((state: RootState) => state.user);
  const { loading, error, success, currentOrder } = useSelector((state: RootState) => state.orders);
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    }
    
    if (items.length === 0) {
      navigate('/cart');
    }
    
    dispatch(fetchUserAddresses());
  }, [dispatch, isAuthenticated, items.length, navigate]);

  useEffect(() => {
    if (success && currentOrder) {
      dispatch(clearCart());
      navigate(`/order-confirmation/${currentOrder._id}`);
    }
  }, [success, currentOrder, dispatch, navigate]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddressId(event.target.value);
    setUseNewAddress(event.target.value === 'new');
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  };

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = () => {
    const selectedAddress = useNewAddress 
      ? newAddress 
      : addresses.find(addr => addr._id === selectedAddressId);
    
    if (!selectedAddress) {
      return;
    }

    const orderData = {
      items: items.map(item => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      shippingAddress: selectedAddress,
      paymentInfo: {
        paymentMethod,
        ...cardInfo,
      },
    };

    dispatch(createOrder(orderData));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            
            {addresses.length > 0 && (
              <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                <FormLabel component="legend">Select an address</FormLabel>
                <RadioGroup
                  aria-label="address"
                  name="address"
                  value={selectedAddressId}
                  onChange={handleAddressChange}
                >
                  {addresses.map((address) => (
                    <FormControlLabel
                      key={address._id}
                      value={address._id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">
                            {address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}
                          </Typography>
                          {address.isDefault && (
                            <Typography variant="caption" color="primary">
                              (Default Address)
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  ))}
                  <FormControlLabel
                    value="new"
                    control={<Radio />}
                    label="Use a new address"
                  />
                </RadioGroup>
              </FormControl>
            )}
            
            {(useNewAddress || addresses.length === 0) && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="street"
                    name="street"
                    label="Street Address"
                    fullWidth
                    value={newAddress.street}
                    onChange={handleNewAddressChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="city"
                    name="city"
                    label="City"
                    fullWidth
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="state"
                    name="state"
                    label="State/Province/Region"
                    fullWidth
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="postalCode"
                    name="postalCode"
                    label="Zip / Postal code"
                    fullWidth
                    value={newAddress.postalCode}
                    onChange={handleNewAddressChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="country"
                    name="country"
                    label="Country"
                    fullWidth
                    value={newAddress.country}
                    onChange={handleNewAddressChange}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <RadioGroup
                aria-label="payment-method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value="creditCard"
                  control={<Radio />}
                  label="Credit Card"
                />
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label="PayPal"
                />
                <FormControlLabel
                  value="cashOnDelivery"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
              </RadioGroup>
            </FormControl>
            
            {paymentMethod === 'creditCard' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="cardName"
                    name="cardName"
                    label="Name on card"
                    fullWidth
                    value={cardInfo.cardName}
                    onChange={handleCardInfoChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="cardNumber"
                    name="cardNumber"
                    label="Card number"
                    fullWidth
                    value={cardInfo.cardNumber}
                    onChange={handleCardInfoChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="expiryDate"
                    name="expiryDate"
                    label="Expiry date (MM/YY)"
                    fullWidth
                    value={cardInfo.expiryDate}
                    onChange={handleCardInfoChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="cvv"
                    name="cvv"
                    label="CVV"
                    helperText="Last three digits on signature strip"
                    fullWidth
                    value={cardInfo.cvv}
                    onChange={handleCardInfoChange}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            {items.map((item) => (
              <Box key={item._id} sx={{ display: 'flex', mb: 2 }}>
                <Box sx={{ width: 80, height: 80, mr: 2 }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.price.toFixed(2)} each
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">${totalAmount.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1">Free</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Tax</Typography>
              <Typography variant="body1">${(totalAmount * 0.1).toFixed(2)}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${(totalAmount + totalAmount * 0.1).toFixed(2)}</Typography>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const isNextDisabled = () => {
    if (activeStep === 0) {
      return useNewAddress
        ? !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode || !newAddress.country
        : !selectedAddressId;
    }
    if (activeStep === 1) {
      return paymentMethod === 'creditCard' && 
        (!cardInfo.cardName || !cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvv);
    }
    return false;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Place Order'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={isNextDisabled()}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutPage; 