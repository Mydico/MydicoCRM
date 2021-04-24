import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {creatingWarehouse, getWarehouse, getDetailWarehouse, updateWarehouse} from './warehouse.api';

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

export const warehousesAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (warehouse) => warehouse.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const slice = createSlice({
  name: 'warehouse',
  initialState: warehousesAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    warehousesAddOne: warehousesAdapter.addOne,
    warehousesAddMany: warehousesAdapter.addMany,
    warehouseUpdate: warehousesAdapter.updateOne,
    warehouseRemove: warehousesAdapter.removeOne,
  },
  extraReducers: {
    [creatingWarehouse.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateWarehouse.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailWarehouse.fulfilled]: (state, action) => {
      warehousesAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getWarehouse.fulfilled]: (state, action) => {
      warehousesAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getWarehouse.rejected]: (state ) => {
      state.loading = false;
    },
  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedWarehouseSelectors = warehousesAdapter.getSelectors((state) => state.warehouse);
