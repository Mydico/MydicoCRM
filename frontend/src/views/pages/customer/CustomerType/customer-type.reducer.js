import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { creatingCustomerType } from '../customer.api';
import { getCustomerType, getDetailCustomerType, updateCustomerType } from './customer-type.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
};

export const customerTypeAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: customerType => customerType.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const slice = createSlice({
  name: 'customerType',
  initialState: customerTypeAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true
    },
    reset(state) {
      state.initialState.loading = false
      state.initialState.updatingSuccess = false
    },
    customerTypeAddOne: customerTypeAdapter.addOne,
    customerTypeAddMany: customerTypeAdapter.addMany,
    customerTypeUpdate: customerTypeAdapter.updateOne,
    customerTypeRemove: customerTypeAdapter.removeOne,
  },
  extraReducers: {
    [creatingCustomerType.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailCustomerType.fulfilled]: (state, action) => {
      customerTypeAdapter.addOne(state, action.payload)
      state.initialState.loading = false;
    },
    [getCustomerType.fulfilled]: (state, action) => {
      customerTypeAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total
      state.initialState.loading = false;
    },
    [updateCustomerType.fulfilled]: (state, action) => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
  },
});

export default slice.reducer;
export const { fetching, reset } = slice.actions

export const globalizedcustomerTypeSelectors = customerTypeAdapter.getSelectors(state => state.customerType);