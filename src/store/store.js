import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceReducer from './slices/serviceSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    orders: orderReducer,
    admin: adminReducer,
  },
}); 