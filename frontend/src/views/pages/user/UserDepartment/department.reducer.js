import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { creatingDepartment, getDepartment, getDetailDepartment, getTreeDepartment, updateDepartment } from './department.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
  treeDepartments: [],
  detail: null
};

export const departmentAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: department => department.id
  // Keep the "all IDs" array sorted based on book titles
  // sortComparer: (a, b) => a.login.localeCompare(b.login),
});

const slice = createSlice({
  name: 'department',
  initialState: departmentAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    departmentAddOne: departmentAdapter.addOne,
    departmentAddMany: departmentAdapter.addMany,
    departmentUpdate: departmentAdapter.updateOne,
    departmentRemove: departmentAdapter.removeOne
  },
  extraReducers: {
    [creatingDepartment.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingDepartment.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateDepartment.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateDepartment.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailDepartment.fulfilled]: (state, action) => {
      state.initialState.detail = action.payload;
      state.initialState.loading = false;
    },
    [getDepartment.fulfilled]: (state, action) => {
      departmentAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getTreeDepartment.fulfilled]: (state, action) => {
      state.initialState.treeDepartments = action.payload.data;
      state.initialState.loading = false;
    },
    [getDepartment.rejected]: state => {
      state.loading = false;
    }
  }
});

export default slice.reducer;
export const { fetching, reset } = slice.actions;

export const globalizedDepartmentSelectors = departmentAdapter.getSelectors(state => state.department);
