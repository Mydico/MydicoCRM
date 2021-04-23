import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { creatingBill, getBillDetail } from './bill.api';
import { getBill, getDetailBill, updateBill } from './bill.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  billDetails: []
};

export const billAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: bill => bill.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.createdDate.localeCompare(b.createdDate)
});

const slice = createSlice({
  name: 'bill',
  initialState: billAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    billAddOne: billAdapter.addOne,
    billAddMany: billAdapter.addMany,
    billUpdate: billAdapter.updateOne,
    billRemove: billAdapter.removeOne
  },
  extraReducers: {
    [creatingBill.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailBill.fulfilled]: (state, action) => {
      billAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getBillDetail.fulfilled]: (state, action) => {
      state.initialState.billDetails = action.payload;
      state.initialState.loading = false;
    },
    [getBill.fulfilled]: (state, action) => {
      billAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [updateBill.fulfilled]: (state, action) => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    }
  }
});

export default slice.reducer;
export const { fetching, reset } = slice.actions;

export const globalizedBillsSelectors = billAdapter.getSelectors(state => state.bill);
