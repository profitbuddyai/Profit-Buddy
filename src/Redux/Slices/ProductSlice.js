import { createSlice } from '@reduxjs/toolkit';
import { ProductSearchData } from '../../Utils/MockData';

const initialState = {
  products: [],
  currentPage: 0,
  searchTerm: '',
  productsLoading: false,
  loadmoreLoading: false,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    pushProducts: (state, action) => {
      state.products = [...state.products, ...action.payload];
    },
    setProductsLoading: (state, action) => {
      state.productsLoading = action.payload;
    },
    setLoadmoreLoading: (state, action) => {
      state.loadmoreLoading = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setProducts, pushProducts, setLoadmoreLoading, setProductsLoading, setCurrentPage, setSearchTerm } = productsSlice.actions;

export const productsReducer = productsSlice.reducer;
