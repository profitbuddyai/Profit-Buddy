'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  userLoading: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserSubscription: (state, action) => {
      if (state.user) {
        state.user.currentSubscription = action.payload;
      }
    },
    setLogout: (state) => {
      state.user = null;
      localStorage.removeItem('ProfitBuddyToken');
      state.userLoading = false;
    },
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
  },
});

export const { setUser, setLogout, setUserLoading, setUserSubscription } = userSlice.actions;

export const userReducer = userSlice.reducer;
