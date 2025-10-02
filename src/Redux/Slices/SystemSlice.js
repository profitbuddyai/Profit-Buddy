import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: false,
};

export const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = systemSlice.actions;

export const systemReducer = systemSlice.reducer;
