import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: 'Hello Pakistan',
};

const helloSlice = createSlice({
  name: 'hello',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});


export const selectMessage = (state) => state.hello.message;

export const { setMessage } = helloSlice.actions;
export default helloSlice.reducer;