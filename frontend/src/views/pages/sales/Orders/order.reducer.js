import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { creatingOrder, getOrderDetail } from './order.api';
import { getOrder, getDetailOrder, updateOrder } from './order.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  orderDetails: [],
};

export const orderAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: order => order.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.createdDate.localeCompare(b.createdDate),
});

const slice = createSlice({
  name: 'order',
  initialState: orderAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    orderAddOne: orderAdapter.addOne,
    orderAddMany: orderAdapter.addMany,
    orderUpdate: orderAdapter.updateOne,
    orderRemove: orderAdapter.removeOne,
  },
  extraReducers: {
    [creatingOrder.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailOrder.fulfilled]: (state, action) => {
      orderAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getOrderDetail.fulfilled]: (state, action) => {
      state.initialState.orderDetails = action.payload;
      state.initialState.loading = false;
    },
    [getOrder.fulfilled]: (state, action) => {
      orderAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [updateOrder.fulfilled]: (state, action) => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
  },
});

export default slice.reducer;
export const { fetching, reset } = slice.actions;

export const globalizedOrdersSelectors = orderAdapter.getSelectors(state => state.order);
