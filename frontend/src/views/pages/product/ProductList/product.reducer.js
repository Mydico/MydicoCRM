import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { creatingProduct, getProduct, getDetailProduct, updateProduct, filterProduct } from './product.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
  cities: [],
  districts: [],
  wards: [],
  type: [],
  branch: [],
  status: []
};

export const productsAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: product => product.id,
  // Keep the "all IDs" array sorted based on book titles
});

const slice = createSlice({
  name: 'product',
  initialState: productsAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    swap(state, action) {
      productsAdapter.setAll(state, action.payload)
    },
    productsAddOne: productsAdapter.addOne,
    productsAddMany: productsAdapter.addMany,
    productUpdate: productsAdapter.updateOne,
    productRemove: productsAdapter.removeOne
  },
  extraReducers: {
    [creatingProduct.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingProduct.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    [updateProduct.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateProduct.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
    [getDetailProduct.fulfilled]: (state, action) => {
      productsAdapter.setAll(state, [action.payload]);
      state.initialState.loading = false;
    },
    [getDetailProduct.rejected]: (state, action) => {
      state.initialState.loading = false;
      state.loading = false;
    },
    [filterProduct.fulfilled]: (state, action) => {
      productsAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [filterProduct.rejected]: state => {
      state.initialState.loading = false;
      state.loading = false;
    },
    [getProduct.fulfilled]: (state, action) => {
      productsAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getProduct.rejected]: state => {
      state.initialState.loading = false;
      state.loading = false;
    }
  }
});

export default slice.reducer;
export const { fetching, reset, swap } = slice.actions;

export const globalizedProductSelectors = productsAdapter.getSelectors(state => state.product);
