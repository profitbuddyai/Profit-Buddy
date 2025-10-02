import { combineReducers } from '@reduxjs/toolkit';
import { productsReducer } from './Slices/ProductSlice';
import { systemReducer } from './Slices/SystemSlice';
import { profitCalcReducer } from './Slices/profitCalcSlice';
import { sellerReducer } from './Slices/SellerSlice';
import { userReducer } from './Slices/UserSlice';
import { historyReducer } from './Slices/HistorySlice';

const rootReducer = combineReducers({
  products: productsReducer,
  system: systemReducer,
  profitCalc: profitCalcReducer,
  seller: sellerReducer,
  user: userReducer,
  history: historyReducer,
});

export default rootReducer;
