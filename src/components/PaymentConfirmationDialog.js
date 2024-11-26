import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

function PaymentConfirmationDialog({ 
  open, 
  onClose, 
  paymentDetails, 
  orderDetails,
  onPaymentConfirmed 
}) {
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  useEffect(() => {
    let interval;
    if (open && paymentDetails) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`/api/v1/payments/verify/${paymentDetails.transactionId}`);
          if (response.data.status === 'completed') {
            setPaymentStatus('completed');
            clearInterval(interval);
            onPaymentConfirmed(paymentDetails);
          }
        } catch (error) {
          console.error('Payment verification error:', error);
        }
      }, 10000); // Check every 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [open, paymentDetails]);

  if (!paymentDetails || !orderDetails) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Complete Your Payment</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Order Details
        </Typography>
        <Typography>Service: {orderDetails.service}</Typography>
        <Typography>Quantity: {orderDetails.quantity}</Typography>
        <Typography>Total Price: ${orderDetails.price}</Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Payment Instructions
        </Typography>
        <Typography gutterBottom>
          Please send exactly {paymentDetails.amount?.toFixed(8)} {paymentDetails.coin}
        </Typography>
        <Typography gutterBottom>
          Network: {paymentDetails.network}
        </Typography>
        
        <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
          <QRCodeSVG 
            value={paymentDetails.address}
            size={200}
            level="H"
          />
        </Box>
        
        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
          Address: {paymentDetails.address}
        </Typography>
        
        {paymentStatus === 'pending' && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            <Typography color="primary">
              Waiting for payment confirmation...
            </Typography>
          </Box>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Typography color="error" variant="body2">
            Important: Send only {paymentDetails.coin} on {paymentDetails.network} network.
            Other networks may result in lost funds.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(paymentDetails.address);
          }}
        >
          Copy Address
        </Button>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentConfirmationDialog; 