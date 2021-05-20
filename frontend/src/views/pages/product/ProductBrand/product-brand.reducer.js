import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {creatingProductBrand} from './product-brand.api';
import {getProductBrand, getDetailProductBrand, updateProductBrand} from './product-brand.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
};

export const productBrandsAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (productBrands) => productBrands.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const slice = createSlice({
  name: 'productBrands',
  initialState: productBrandsAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    productBrandsAddOne: productBrandsAdapter.addOne,
    productBrandsAddMany: productBrandsAdapter.addMany,
    productBrandsUpdate: productBrandsAdapter.updateOne,
    productBrandsRemove: productBrandsAdapter.removeOne,
  },
  extraReducers: {
    [creatingProductBrand.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingProductBrand.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
    [getDetailProductBrand.fulfilled]: (state, action) => {
      productBrandsAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getProductBrand.fulfilled]: (state, action) => {
      productBrandsAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [updateProductBrand.fulfilled]: (state ) => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
    [updateProductBrand.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedproductBrandsSelectors = productBrandsAdapter.getSelectors((state) => state.productBrand);
