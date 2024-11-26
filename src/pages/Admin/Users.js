import React, { useEffect, useState } from 'react';
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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserRole, deleteUser } from '../../store/slices/adminSlice';
import { toast } from 'react-toastify';

function AdminUsers() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.admin);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
    credits: 0,
    isVerified: false
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      role: user.role,
      credits: user.credits || 0,
      isVerified: user.isVerified
    });
    setEditDialog(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await dispatch(deleteUser(userId));
      if (!result.error) {
        toast.success('User deleted successfully');
        dispatch(fetchAllUsers());
      }
    }
  };

  const handleSubmit = async () => {
    const result = await dispatch(updateUserRole({
      userId: selectedUser._id,
      ...formData
    }));
    if (!result.error) {
      setEditDialog(false);
      dispatch(fetchAllUsers());
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role.toUpperCase()}
                    color={user.role === 'admin' ? 'error' : 'primary'}
                  />
                </TableCell>
                <TableCell>${user.credits || 0}</TableCell>
                <TableCell>
                  <Chip
                    label={user.isVerified ? 'Verified' : 'Unverified'}
                    color={user.isVerified ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="support">Support</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Credits"
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Verification Status"
            value={formData.isVerified}
            onChange={(e) => setFormData({ ...formData, isVerified: e.target.value })}
          >
            <MenuItem value={true}>Verified</MenuItem>
            <MenuItem value={false}>Unverified</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminUsers; 