import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {
  creatingProductWarehouse,
  getProductWarehouse,
  getDetailProductWarehouse,
  updateProductWarehouse,
  getProductInstore,
  filterProductInStore,
} from './product-warehouse.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
  cities: [],
  districts: [],
  wards: [],
  type: [],
  branch: [],
  status: [],
};

export const productWarehousesAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (productWarehouse) => productWarehouse.id,
  // Keep the "all IDs" array sorted based on book titles
});

const slice = createSlice({
  name: 'productWarehouse',
  initialState: productWarehousesAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      productWarehousesAdapter.removeAll(state)
      state.initialState.updatingSuccess = false;
    },
    swap(state, action) {
      productWarehousesAdapter.setAll(state, action.payload)
    },
    productWarehousesAddOne: productWarehousesAdapter.addOne,
    productWarehousesAddMany: productWarehousesAdapter.addMany,
    productWarehouseUpdate: productWarehousesAdapter.updateOne,
    productWarehouseRemove: productWarehousesAdapter.removeOne,
  },
  extraReducers: {
    [creatingProductWarehouse.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateProductWarehouse.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailProductWarehouse.fulfilled]: (state, action) => {
      productWarehousesAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [filterProductInStore.fulfilled]: (state, action) => {
      productWarehousesAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [filterProductInStore.rejected]: (state, action) => {
      state.initialState.loading = false;
    },
    [getProductWarehouse.fulfilled]: (state, action) => {
      productWarehousesAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getProductWarehouse.rejected]: (state, action) => {
      state.initialState.loading = false;
    },
    [getProductInstore.fulfilled]: (state, action) => {
      state.initialState.loading = false;
    },
    [getProductWarehouse.rejected]: (state ) => {
      state.loading = false;
    },
  },
});

export default slice.reducer;
export const {fetching, reset, swap} = slice.actions;

export const globalizedProductWarehouseSelectors = productWarehousesAdapter.getSelectors((state) => state.productWarehouse);
