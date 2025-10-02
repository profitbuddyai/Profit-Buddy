import { createSlice } from '@reduxjs/toolkit';
import { calculateTotalFees, calculateMaxCost, calculateProfitAndROI } from '../../Utils/CalculationUtils';
import { PLACEMENT_FEE_TYPES } from '../../Enums/Enums';
import { singleAsin } from '../../Utils/MockData';

const initialState = {
  product: {},
  buyCost: 0,
  salePrice: 0,
  storageMonth: 0,
  fulfillment: 'FBA',
  fbmFee: 0,
  placementFeeType: PLACEMENT_FEE_TYPES[0], // minimal , partial , optimized

  // derived values
  fees: null,
  maxCost: 0,
  profit: 0,
  roi: 0,
};

const profitCalcSlice = createSlice({
  name: 'profitCalc',
  initialState,
  reducers: {
    setProduct(state, action) {
      const product = action.payload;
      state.product = product;
      state.salePrice = Number((product?.info?.salePrice ?? 0).toFixed(2));
      state.buyCost = product?.history?.buyCost || 0;
      state.storageMonth = 0;
      state.fulfillment = 'FBA';
      profitCalcSlice.caseReducers.recalculate(state);
    },
    setBuyCost(state, action) {
      const val = action.payload;
      if (val === '') {
        state.buyCost = '';
      } else {
        state.buyCost = val < 0 ? 0 : val; // clamp at 0
      }
      profitCalcSlice.caseReducers.recalculate(state);
    },

    setsalePrice(state, action) {
      const val = action.payload;
      if (val === '') {
        state.salePrice = '';
      } else {
        state.salePrice = val < 0 ? 0 : val; // clamp at 0
      }
      profitCalcSlice.caseReducers.recalculate(state);
    },
    setStorageMonth(state, action) {
      state.storageMonth = action.payload;
      profitCalcSlice.caseReducers.recalculate(state);
    },

    setFulfillment(state, action) {
      state.fulfillment = action.payload;
      profitCalcSlice.caseReducers.recalculate(state);
    },

    setFbmFee(state, action) {
      const val = action.payload;
      if (val === '') {
        state.fbmFee = '';
      } else {
        state.fbmFee = val < 0 ? 0 : val; // clamp at 0
      }
      profitCalcSlice.caseReducers.recalculate(state);
    },

    setPlacementFeeType(state, action) {
      if (!PLACEMENT_FEE_TYPES.includes(action.payload)) return;
      state.placementFeeType = action.payload;
      profitCalcSlice.caseReducers.recalculate(state);
    },

    // place to recalc all derived values
    recalculate(state) {

      const fees = calculateTotalFees(state.product, state.salePrice, state.storageMonth, state.fulfillment === 'FBA', state.fbmFee, state.placementFeeType);
      state.fees = fees;
      state.maxCost = calculateMaxCost(state.salePrice, fees?.totalFees);
      const { profit, roi } = calculateProfitAndROI(fees?.totalFees, state.salePrice, state.buyCost);

      state.profit = profit;
      state.roi = roi;
    },
  },
});

export const { setProduct, setBuyCost, setsalePrice, setStorageMonth, setFulfillment, setFbmFee, recalculate, setPlacementFeeType } = profitCalcSlice.actions;

export const profitCalcReducer = profitCalcSlice.reducer;
