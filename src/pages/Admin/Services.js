import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

function AdminServices() {
  const { services } = useSelector((state) => state.services);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    type: '',
    description: '',
    minQuantity: '',
    maxQuantity: '',
    pricePerUnit: '',
    deliveryTime: '',
    active: true,
  });

  const platforms = [
    'instagram',
    'youtube',
    'facebook',
    'telegram',
    'tiktok',
    'twitter',
    'spotify',
    'discord',
    'soundcloud',
    'linkedin',
    'vk',
  ];

  const serviceTypes = [
    'followers',
    'likes',
    'views',
    'members',
    'subscribers',
    'comments',
    'reactions',
    'retweets',
    'plays',
    'monthly_listeners',
    'online_members',
    'watch_time',
  ];

  const handleEdit = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      platform: service.platform,
      type: service.type,
      description: service.description,
      minQuantity: service.minQuantity,
      maxQuantity: service.maxQuantity,
      pricePerUnit: service.pricePerUnit,
      deliveryTime: service.deliveryTime,
      active: service.active,
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedService(null);
    setFormData({
      name: '',
      platform: '',
      type: '',
      description: '',
      minQuantity: '',
      maxQuantity: '',
      pricePerUnit: '',
      deliveryTime: '',
      active: true,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    // TODO: Implement service creation/update
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manage Services</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Service
        </Button>
      </Box>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {service.name}
                </Typography>
                <Typography color="textSecondary">
                  Platform: {service.platform}
                </Typography>
                <Typography color="textSecondary">
                  Type: {service.type}
                </Typography>
                <Typography>
                  Price: ${service.pricePerUnit} per unit
                </Typography>
                <Typography>
                  Status: {service.active ? 'Active' : 'Inactive'}
                </Typography>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(service)}
                  sx={{ mt: 2 }}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedService ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Service Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            label="Platform"
            fullWidth
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
          >
            {platforms.map((platform) => (
              <MenuItem key={platform} value={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            label="Service Type"
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            {serviceTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Minimum Quantity"
            type="number"
            fullWidth
            value={formData.minQuantity}
            onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Maximum Quantity"
            type="number"
            fullWidth
            value={formData.maxQuantity}
            onChange={(e) => setFormData({ ...formData, maxQuantity: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price per Unit"
            type="number"
            fullWidth
            value={formData.pricePerUnit}
            onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Delivery Time"
            fullWidth
            value={formData.deliveryTime}
            onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedService ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminServices; 