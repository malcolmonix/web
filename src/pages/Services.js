import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import { fetchServices } from '../store/slices/serviceSlice';
import { createOrder } from '../store/slices/orderSlice';
import PaymentConfirmationDialog from '../components/PaymentConfirmationDialog';
import axios from 'axios';

// Define available networks for each cryptocurrency
const cryptoNetworks = {
  BTC: ['Bitcoin'],
  ETH: ['ERC20'],
  USDT: ['ERC20', 'TRC20', 'BEP20'],
  BNB: ['BEP20'],
  DOGE: ['Dogecoin']
};

function Services() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { services, isLoading } = useSelector((state) => state.services);
  const [selectedPlatform, setSelectedPlatform] = useState(
    location.state?.platform || 'all'
  );
  const [orderDialog, setOrderDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    quantity: '',
    targetUrl: '',
    paymentMethod: 'stripe',
    network: ''
  });
  const [paymentConfirmation, setPaymentConfirmation] = useState({
    open: false,
    details: null,
    orderDetails: null
  });
  const [paymentStep, setPaymentStep] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const filteredServices = selectedPlatform === 'all'
    ? services
    : services.filter(service => service.platform === selectedPlatform);

  const handleOrderClick = (service) => {
    setSelectedService(service);
    setOrderDialog(true);
  };

  const handleProceedToPayment = async () => {
    // Validate order details
    if (!orderDetails.quantity || !orderDetails.targetUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Calculate total price
    const totalPrice = selectedService.pricePerUnit * orderDetails.quantity;

    if (['BTC', 'ETH', 'USDT', 'BNB', 'DOGE'].includes(orderDetails.paymentMethod)) {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
        const response = await axios.post(`${API_URL}/payments/crypto`, {
          amount: totalPrice,
          coin: orderDetails.paymentMethod,
          network: orderDetails.network
        });

        if (response.data.status === 'success') {
          setPaymentData(response.data);
          setOrderDialog(false);
          setPaymentConfirmation({
            open: true,
            details: response.data.paymentDetails,
            orderDetails: {
              ...orderDetails,
              service: selectedService.name,
              price: totalPrice
            }
          });
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Payment setup error:', error);
        toast.error(error.response?.data?.message || 'Error setting up payment');
      }
    } else if (orderDetails.paymentMethod === 'stripe') {
      // Handle Stripe payment
      // Redirect to Stripe checkout or show Stripe payment form
    }
  };

  const handlePaymentConfirmed = async (paymentDetails) => {
    try {
      // Create order with payment confirmation
      const orderData = {
        serviceId: selectedService._id,
        ...orderDetails,
        paymentDetails
      };
      
      const result = await dispatch(createOrder(orderData));
      
      if (!result.error) {
        toast.success('Order created successfully!');
        setPaymentConfirmation({ open: false, details: null, orderDetails: null });
        setOrderDetails({
          quantity: '',
          targetUrl: '',
          paymentMethod: 'stripe',
          network: ''
        });
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Error creating order');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Services
      </Typography>
      <Grid container spacing={3}>
        {filteredServices.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {service.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Platform: {service.platform}
                </Typography>
                <Typography variant="body2" paragraph>
                  {service.description}
                </Typography>
                <Typography variant="body2">
                  Price: ${service.pricePerUnit} per unit
                </Typography>
                <Typography variant="body2">
                  Delivery Time: {service.deliveryTime}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleOrderClick(service)}
                >
                  Order Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={orderDialog} onClose={() => setOrderDialog(false)}>
        <DialogTitle>Place Order</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={orderDetails.quantity}
            onChange={(e) =>
              setOrderDetails({ ...orderDetails, quantity: e.target.value })
            }
            inputProps={{
              min: selectedService?.minQuantity,
              max: selectedService?.maxQuantity,
            }}
          />
          <TextField
            margin="dense"
            label="Target URL"
            type="text"
            fullWidth
            value={orderDetails.targetUrl}
            onChange={(e) =>
              setOrderDetails({ ...orderDetails, targetUrl: e.target.value })
            }
          />
          <TextField
            select
            margin="dense"
            label="Payment Method"
            fullWidth
            value={orderDetails.paymentMethod}
            onChange={(e) => {
              setOrderDetails({ 
                ...orderDetails, 
                paymentMethod: e.target.value,
                network: '' // Reset network when payment method changes
              });
            }}
          >
            <MenuItem value="BTC">Bitcoin (BTC)</MenuItem>
            <MenuItem value="ETH">Ethereum (ETH)</MenuItem>
            <MenuItem value="USDT">USDT</MenuItem>
            <MenuItem value="BNB">BNB</MenuItem>
            <MenuItem value="DOGE">Dogecoin</MenuItem>
            <MenuItem value="stripe">Credit Card</MenuItem>
          </TextField>
          {['BTC', 'ETH', 'USDT', 'BNB', 'DOGE'].includes(orderDetails.paymentMethod) && (
            <TextField
              select
              margin="dense"
              label="Network"
              fullWidth
              value={orderDetails.network}
              onChange={(e) =>
                setOrderDetails({ ...orderDetails, network: e.target.value })
              }
            >
              {cryptoNetworks[orderDetails.paymentMethod].map((network) => (
                <MenuItem key={network} value={network}>
                  {network}
                </MenuItem>
              ))}
            </TextField>
          )}
          {selectedService && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Total Price: $
              {(selectedService.pricePerUnit * orderDetails.quantity).toFixed(2)}
            </Typography>
          )}
          <Button
            onClick={handleProceedToPayment}
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Proceed to Payment
          </Button>
        </DialogContent>
      </Dialog>

      <PaymentConfirmationDialog
        open={paymentConfirmation.open}
        onClose={() => setPaymentConfirmation({ open: false, details: null, orderDetails: null })}
        paymentDetails={paymentConfirmation.details}
        orderDetails={paymentConfirmation.orderDetails}
        onPaymentConfirmed={handlePaymentConfirmed}
      />
    </Box>
  );
}

export default Services; 