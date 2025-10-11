import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  seller: {},
  sellerCurrentPage: 1,
  sellerProductsLoading: false,
  sellerLoading: false,
};

export const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setSeller: (state, action) => {
      state.seller = { ...state.seller, ...action.payload };
    },
    setSellerProducts: (state, action) => {
      state.seller.products = action.payload;
    },
    pushSellerProducts: (state, action) => {
      state.seller.products = [...(state?.seller?.products || []), ...action.payload];
    },
    setSellerLoading: (state, action) => {
      state.sellerLoading = action.payload;
    },
    setSellerProductsLoading: (state, action) => {
      state.sellerProductsLoading = action.payload;
    },
    setSellerAsins: (state, action) => {
      state.seller.asins = action.payload;
    },
    setSellerCurrentPage: (state, action) => {
      state.sellerCurrentPage = action.payload;
    },
    resetSellerSlice: () => initialState,
  },
});

export const { setSeller, pushSellerProducts, setSellerLoading, setSellerProductsLoading, setSellerCurrentPage, setSellerAsins, resetSellerSlice, setSellerProducts } =
  sellerSlice.actions;

export const sellerReducer = sellerSlice.reducer;
