import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
} from '@mui/material';
import { updateProfile } from '../store/slices/authSlice';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(formData));
    if (!result.error) {
      setIsEditing(false);
      setFormData({ ...formData, currentPassword: '', newPassword: '' });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              {!isEditing ? (
                <>
                  <Typography>
                    <strong>Name:</strong> {user?.name}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {user?.email}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {user?.phoneNumber || 'Not set'}
                  </Typography>
                  <Typography>
                    <strong>Role:</strong> {user?.role}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    sx={{ mt: 2 }}
                  >
                    Edit Profile
                  </Button>
                </>
              ) : (
                <form onSubmit={handleSubmit}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Change Password (optional)
                  </Typography>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{ mr: 1 }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Referral Program
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Share your referral code with friends and earn credits!
              </Alert>
              <Typography variant="body1" gutterBottom>
                Your Referral Code: <strong>{user?.referralCode}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Available Credits: <strong>${user?.credits || 0}</strong>
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(user?.referralCode);
                }}
                sx={{ mt: 1 }}
              >
                Copy Referral Code
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile; 