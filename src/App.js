import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Auth Components
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminOrders from './pages/Admin/Orders';
import AdminServices from './pages/Admin/Services';
import AdminUsers from './pages/Admin/Users';
import AdminSettings from './pages/Admin/Settings';

import socketService from './services/socketService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Admin Route component that checks for admin role
const AdminRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  
  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      socketService.connect(user.id);
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 