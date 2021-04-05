import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { creatingProduct, creatingProductStatus, creatingProductType, getBranches, getCity, getProduct, getProductBirthday, getProductStatus, getProductType, getDetailProduct, getDistrict, getWard, updateProduct } from './product.api';

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
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const slice = createSlice({
  name: 'product',
  initialState: productsAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true
    },
    reset(state) {
      state.initialState.loading = false
      state.initialState.updatingSuccess = false
    },
    productsAddOne: productsAdapter.addOne,
    productsAddMany: productsAdapter.addMany,
    productUpdate: productsAdapter.updateOne,
    productRemove: productsAdapter.removeOne,
  },
  extraReducers: {
    [creatingProduct.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateProduct.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailProduct.fulfilled]: (state, action) => {
      productsAdapter.addOne(state, action.payload)
      state.initialState.loading = false;
    },
    [creatingProductStatus.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
    },
    [creatingProductType.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
    },
    [getProduct.fulfilled]: (state, action) => {
      productsAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total
      state.initialState.loading = false;
    },
    [getProduct.rejected]: (state, action) => {
      state.initialState.loading = false;
    },
    [getProductBirthday.fulfilled]: (state, action) => {
      productsAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total
      state.initialState.loading = false;
    },
    [getCity.fulfilled]: (state, action) => {
      state.initialState.cities = action.payload
      state.initialState.loading = false;
    },
    [getDistrict.fulfilled]: (state, action) => {
      state.initialState.districts = action.payload
      state.initialState.loading = false;
    },
    [getWard.fulfilled]: (state, action) => {
      state.initialState.wards = action.payload
      state.initialState.loading = false;
    },
    [getProductType.fulfilled]: (state, action) => {
      state.initialState.type = action.payload
      state.initialState.loading = false;
    },
    [getProductStatus.fulfilled]: (state, action) => {
      state.initialState.status = action.payload
      state.initialState.loading = false;
    },
    [getBranches.fulfilled]: (state, action) => {
      state.initialState.branch = action.payload
      state.initialState.loading = false;
    },
    [getProduct.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export default slice.reducer;
export const { fetching, reset } = slice.actions

export const globalizedProductSelectors = productsAdapter.getSelectors(state => state.product);