import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  totalCount: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistoryLoading: (state, action) => {
      state.loading = action.payload;
    },
    setHistoryData: (state, action) => {
      const { products, totalCount, page, limit } = action.payload;
      state.products = products;
      state.totalCount = totalCount;
      state.page = page;
      state.limit = limit;
      state.loading = false;
      state.error = null;
    },
    setHistoryError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.products = [];
    },
    setHistoryPage: (state, action) => {
      state.page = action.payload;
    },
    setHistoryLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
});

export const { setHistoryLoading, setHistoryData, setHistoryError, setHistoryPage, setHistoryLimit } = historySlice.actions;
export const historyReducer = historySlice.reducer;
