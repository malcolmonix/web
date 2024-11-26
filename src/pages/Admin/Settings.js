import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../store/slices/adminSlice';

function AdminSettings() {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.admin);
  const [formData, setFormData] = useState({
    minOrderAmount: settings?.minOrderAmount || 1,
    maxOrderAmount: settings?.maxOrderAmount || 10000,
    referralBonus: settings?.referralBonus || 5,
    maintenanceMode: settings?.maintenanceMode || false,
    stripeEnabled: settings?.stripeEnabled || true,
    cryptoEnabled: settings?.cryptoEnabled || true,
    autoApproveOrders: settings?.autoApproveOrders || false,
    notificationEmail: settings?.notificationEmail || '',
    supportEmail: settings?.supportEmail || '',
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateSettings(formData));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Order Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Settings
                </Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Minimum Order Amount"
                  name="minOrderAmount"
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Maximum Order Amount"
                  name="maxOrderAmount"
                  type="number"
                  value={formData.maxOrderAmount}
                  onChange={handleChange}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.autoApproveOrders}
                      onChange={handleChange}
                      name="autoApproveOrders"
                    />
                  }
                  label="Auto-approve Orders"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Settings
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.stripeEnabled}
                      onChange={handleChange}
                      name="stripeEnabled"
                    />
                  }
                  label="Enable Stripe Payments"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.cryptoEnabled}
                      onChange={handleChange}
                      name="cryptoEnabled"
                    />
                  }
                  label="Enable Crypto Payments"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Referral Bonus (%)"
                  name="referralBonus"
                  type="number"
                  value={formData.referralBonus}
                  onChange={handleChange}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* System Settings */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Settings
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.maintenanceMode}
                      onChange={handleChange}
                      name="maintenanceMode"
                    />
                  }
                  label="Maintenance Mode"
                />
                <Divider sx={{ my: 2 }} />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Notification Email"
                  name="notificationEmail"
                  type="email"
                  value={formData.notificationEmail}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Support Email"
                  name="supportEmail"
                  type="email"
                  value={formData.supportEmail}
                  onChange={handleChange}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Save Settings
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default AdminSettings; 