import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {creatingReceipt, updateReceiptStatus} from './receipt.api';
import {getReceipt, getDetailReceipt, updateReceipt} from './receipt.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  receiptDetails: [],
};

export const receiptAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (receipt) => receipt.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => b.createdDate.localeCompare(a.createdDate),
});

const slice = createSlice({
  name: 'receipt',
  initialState: receiptAdapter.getInitialState({initialState}),
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
    receiptRemove: receiptAdapter.removeOne,
  },
  extraReducers: {
    [creatingReceipt.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingReceipt.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
    [getDetailReceipt.fulfilled]: (state, action) => {
      receiptAdapter.setAll(state, [action.payload]);
      state.initialState.loading = false;
    },
    [getDetailReceipt.rejected]: (state, action) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getReceipt.fulfilled]: (state, action) => {
      receiptAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [updateReceiptStatus.fulfilled]: (state ) => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
    [updateReceiptStatus.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    [updateReceipt.fulfilled]: (state ) => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
    [updateReceipt.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedReceiptsSelectors = receiptAdapter.getSelectors((state) => state.receipt);
