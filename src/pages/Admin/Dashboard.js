import React, { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  PeopleAlt,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../../store/slices/adminSlice';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<PeopleAlt sx={{ fontSize: 40 }} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={<ShoppingCart sx={{ fontSize: 40 }} />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Revenue"
            value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
            icon={<AttachMoney sx={{ fontSize: 40 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Orders"
            value={stats?.pendingOrders || 0}
            icon={<Warning sx={{ fontSize: 40 }} />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Completed Orders"
            value={stats?.completedOrders || 0}
            icon={<CheckCircle sx={{ fontSize: 40 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Growth Rate"
            value={`${stats?.growthRate || 0}%`}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Latest Orders
                </Typography>
                {stats?.recentOrders?.map((order) => (
                  <Box key={order._id} mb={2}>
                    <Typography variant="subtitle1">
                      {order.service}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Latest Users
                </Typography>
                {stats?.recentUsers?.map((user) => (
                  <Box key={user._id} mb={2}>
                    <Typography variant="subtitle1">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.email}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AdminDashboard; 