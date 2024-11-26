import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import { fetchUserOrders } from '../store/slices/orderSlice';
import socketService from '../services/socketService';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  failed: 'error',
  refunded: 'default',
};

function Orders() {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());

    // Listen for order updates
    socketService.onOrderUpdate((updatedOrder) => {
      dispatch(fetchUserOrders()); // Refresh orders when update received
    });
  }, [dispatch]);

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
        My Orders
      </Typography>
      <Grid container spacing={3}>
        {orders && orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                      {order.service}
                    </Typography>
                    <Typography color="textSecondary">
                      Order ID: {order._id}
                    </Typography>
                    <Typography>
                      Quantity: {order.quantity}
                    </Typography>
                    <Typography>
                      Target URL: {order.targetUrl}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                    <Chip
                      label={(order.status || 'pending').toUpperCase()}
                      color={statusColors[order.status || 'pending']}
                      sx={{ mb: 1 }}
                    />
                    <Typography>
                      Price: ${order.price}
                    </Typography>
                    <Typography color="textSecondary">
                      Payment Method: {order.paymentMethod}
                    </Typography>
                    {order.paymentDetails && (
                      <>
                        <Typography color="textSecondary">
                          Crypto Amount: {order.paymentDetails.amount?.toFixed(8)} {order.paymentDetails.coin}
                        </Typography>
                        <Typography color="textSecondary">
                          Network: {order.paymentDetails.network}
                        </Typography>
                        <Typography color="textSecondary" sx={{ wordBreak: 'break-all' }}>
                          Address: {order.paymentDetails.address}
                        </Typography>
                      </>
                    )}
                    <Typography color="textSecondary">
                      Payment Status: {order.paymentStatus || 'pending'}
                    </Typography>
                    <Typography color="textSecondary" variant="caption">
                      Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {(!orders || orders.length === 0) && (
          <Grid item xs={12}>
            <Typography textAlign="center" color="textSecondary">
              No orders found
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Orders; 