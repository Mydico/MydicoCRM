import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { creatingCustomerStatus } from '../customer.api';
import { getCustomerStatus, getDetailCustomerStatus, updateCustomerStatus } from './customer-status.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
};

export const customerStatusAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: customerStatus => customerStatus.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const slice = createSlice({
  name: 'customerStatus',
  initialState: customerStatusAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true
    },
    reset(state) {
      state.initialState.loading = false
      state.initialState.updatingSuccess = false
    },
    customerStatusAddOne: customerStatusAdapter.addOne,
    customerStatusAddMany: customerStatusAdapter.addMany,
    customerStatusUpdate: customerStatusAdapter.updateOne,
    customerStatusRemove: customerStatusAdapter.removeOne,
  },
  extraReducers: {
    [creatingCustomerStatus.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailCustomerStatus.fulfilled]: (state, action) => {
      customerStatusAdapter.addOne(state, action.payload)
      state.initialState.loading = false;
    },
    [getCustomerStatus.fulfilled]: (state, action) => {
      customerStatusAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total
      state.initialState.loading = false;
    },
    [updateCustomerStatus.fulfilled]: (state, action) => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
  },
});

export default slice.reducer;
export const { fetching, reset } = slice.actions

export const globalizedcustomerStatuselectors = customerStatusAdapter.getSelectors(state => state.customerStatus);