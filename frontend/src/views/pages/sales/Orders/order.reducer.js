import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { creatingOrder, editSelfOrder, getOrderwithproduct, updateStatusOrder } from './order.api';
import { getOrder, getDetailOrder, updateOrder } from './order.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  updateStatusSuccess: false,
  orderDetails: [],
  totalItem: 0
};

export const orderAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: order => order.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => {
    if (b.createdDate && a.createdDate) return b.createdDate.localeCompare(a.createdDate);
    return 1
  }
});

const slice = createSlice({
  name: 'order',
  initialState: orderAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.orderDetails = []
      state.initialState.loading = false;
      orderAdapter.setAll(state, []);
      state.initialState.updateStatusSuccess = false;
      state.initialState.updatingSuccess = false;
    },
    orderAddOne: orderAdapter.addOne,
    orderAddMany: orderAdapter.addMany,
    orderUpdate: orderAdapter.updateOne,
    orderRemove: orderAdapter.removeOne
  },
  extraReducers: {
    [creatingOrder.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingOrder.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailOrder.fulfilled]: (state, action) => {
      orderAdapter.setAll(state, [action.payload]);
      state.initialState.loading = false;
    },
    [getDetailOrder.pending]: (state, action) => {
      orderAdapter.setAll(state, []);
      state.initialState.loading = false;
    },
    [getDetailOrder.rejected]: (state, action) => {
      state.initialState.loading = false;
    },
    [getOrder.fulfilled]: (state, action) => {
      orderAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getOrder.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    [getOrderwithproduct.fulfilled]: (state, action) => {
      orderAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getOrderwithproduct.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    [updateStatusOrder.fulfilled]: state => {
      state.initialState.loading = false;
      state.initialState.updateStatusSuccess = true;
    },
    [updateStatusOrder.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updateStatusSuccess = false;
    },
    [updateOrder.fulfilled]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
    [updateOrder.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    [editSelfOrder.fulfilled]: state => {
      state.initialState.loading = false;
      state.initialState.updateStatusSuccess = true;
    },
    [editSelfOrder.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updateStatusSuccess = false;
    }
  }
});

export default slice.reducer;
export const { fetching, reset } = slice.actions;

export const globalizedOrdersSelectors = orderAdapter.getSelectors(state => state.order);
