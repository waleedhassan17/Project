import { configureStore } from '@reduxjs/toolkit';
import helloReducer from '../screens/HomeScreen/homeScreenSlice';
import authSlice from '../screens/AuthenticationScreens/authSlice';

export const store = configureStore({
  reducer: {
    hello: helloReducer,
    auth: authSlice,
    
  },
});
