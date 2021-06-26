import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {
  creatingWarehouseImport,
  getWarehouseImport,
  getDetailWarehouseImport,
  updateWarehouseImport,
  getWarehouseExport,
  updateWarehouseStatusImport,
  getWarehouseReturn,
  creatingWarehouseExport,
  creatingWarehouseReturn,
  updateWarehouseExport,
  updateWarehouseReturn,
} from './warehouse-import.api';

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

export const warehouseImportAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (warehouse) => warehouse.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => b.createdDate.localeCompare(a.createdDate),
});

const slice = createSlice({
  name: 'warehouseImport',
  initialState: warehouseImportAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    warehousesAddOne: warehouseImportAdapter.addOne,
    warehousesAddMany: warehouseImportAdapter.addMany,
    warehouseUpdate: warehouseImportAdapter.updateOne,
    warehouseRemove: warehouseImportAdapter.removeOne,
  },
  extraReducers: {
    [creatingWarehouseImport.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingWarehouseImport.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [creatingWarehouseExport.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingWarehouseExport.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [creatingWarehouseReturn.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingWarehouseReturn.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateWarehouseStatusImport.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateWarehouseStatusImport.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateWarehouseImport.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateWarehouseExport.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateWarehouseExport.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateWarehouseReturn.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateWarehouseReturn.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateWarehouseImport.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailWarehouseImport.fulfilled]: (state, action) => {
      warehouseImportAdapter.setAll(state, [action.payload]);
      state.initialState.loading = false;
    },
    [getWarehouseImport.fulfilled]: (state, action) => {
      warehouseImportAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getWarehouseImport.rejected]: (state ) => {
      state.loading = false;
    },
    [getWarehouseReturn.fulfilled]: (state, action) => {
      warehouseImportAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getWarehouseReturn.rejected]: (state ) => {
      state.loading = false;
    },
    [getWarehouseExport.fulfilled]: (state, action) => {
      warehouseImportAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },

  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedWarehouseImportSelectors = warehouseImportAdapter.getSelectors((state) => state.warehouseImport);
