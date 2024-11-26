import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/adminSlice';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  failed: 'error',
  refunded: 'default',
};

function AdminOrders() {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.admin);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusUpdate = async () => {
    await dispatch(updateOrderStatus({ 
      orderId: selectedOrder._id, 
      status: newStatus 
    }));
    setStatusDialog(false);
    dispatch(fetchAllOrders());
  };

  const handleStatusClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialog(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Orders
      </Typography>

      <Grid container spacing={3}>
        {orders?.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>
                      {order.service}
                    </Typography>
                    <Typography color="textSecondary">
                      Order ID: {order._id}
                    </Typography>
                    <Typography>
                      User: {order.user.email}
                    </Typography>
                    <Typography>
                      Quantity: {order.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography>
                      Target URL: {order.targetUrl}
                    </Typography>
                    <Typography>
                      Payment Method: {order.paymentMethod}
                    </Typography>
                    <Typography>
                      Price: ${order.price}
                    </Typography>
                    <Typography color="textSecondary">
                      Created: {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                    <Chip
                      label={order.status.toUpperCase()}
                      color={statusColors[order.status]}
                      sx={{ mb: 1 }}
                      onClick={() => handleStatusClick(order)}
                    />
                    <Typography>
                      Payment Status: {order.paymentStatus}
                    </Typography>
                    {order.paymentDetails && (
                      <>
                        <Typography variant="body2">
                          Crypto: {order.paymentDetails.amount} {order.paymentDetails.coin}
                        </Typography>
                        <Typography variant="body2">
                          Network: {order.paymentDetails.network}
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="refunded">Refunded</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminOrders; 