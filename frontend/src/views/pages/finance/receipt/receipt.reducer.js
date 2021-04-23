import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { creatingReceipt, getReceiptDetail } from './receipt.api';
import { getReceipt, getDetailReceipt, updateReceipt } from './receipt.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  receiptDetails: []
};

export const receiptAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: receipt => receipt.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => b.createdDate.localeCompare(a.createdDate)
});

const slice = createSlice({
  name: 'receipt',
  initialState: receiptAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    receiptAddOne: receiptAdapter.addOne,
    receiptAddMany: receiptAdapter.addMany,
    receiptUpdate: receiptAdapter.updateOne,
    receiptRemove: receiptAdapter.removeOne
  },
  extraReducers: {
    [creatingReceipt.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailReceipt.fulfilled]: (state, action) => {
      receiptAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getReceipt.fulfilled]: (state, action) => {
      receiptAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [updateReceipt.fulfilled]: (state, action) => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    }
  }
});

export default slice.reducer;
export const { fetching, reset } = slice.actions;

export const globalizedReceiptsSelectors = receiptAdapter.getSelectors(state => state.receipt);
