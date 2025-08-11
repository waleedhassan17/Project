import { configureStore } from '@reduxjs/toolkit';
import helloReducer from '../screens/HomeScreen/homeScreenSlice';

export const store = configureStore({
  reducer: {
    hello: helloReducer,
  },
});
