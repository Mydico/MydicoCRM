import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {
  creatingPermissionGroups,
  getPermissionGroups,
  getDetailPermissionGroups,
  updatePermissionGroups,
  getPermissionType,
  getPermissions,
} from './permission.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
  permissionTypes: [],
  permissions: [],
};

export const permissionGroupsAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (permissionGroups) => permissionGroups.id,
  // Keep the "all IDs" array sorted based on book titles
  // sortComparer: (a, b) => a.login.localeCompare(b.login),
});

const slice = createSlice({
  name: 'permissionGroups',
  initialState: permissionGroupsAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.permissions = [];
      state.initialState.updatingSuccess = false;
    },
    permissionGroupsAddOne: permissionGroupsAdapter.addOne,
    permissionGroupsAddMany: permissionGroupsAdapter.addMany,
    permissionGroupsUpdate: permissionGroupsAdapter.updateOne,
    permissionGroupsRemove: permissionGroupsAdapter.removeOne,
  },
  extraReducers: {
    [creatingPermissionGroups.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingPermissionGroups.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getPermissionType.fulfilled]: (state, action) => {
      state.initialState.loading = false;
      state.initialState.permissionTypes = action.payload;
    },
    [getPermissionType.rejected]: (state ) => {
      state.initialState.loading = false;
    },
    [updatePermissionGroups.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updatePermissionGroups.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailPermissionGroups.fulfilled]: (state, action) => {
      permissionGroupsAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getPermissionGroups.fulfilled]: (state, action) => {
      permissionGroupsAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getPermissionGroups.rejected]: (state ) => {
      state.loading = false;
    },
    [getPermissions.fulfilled]: (state, action) => {
      state.initialState.loading = false;
      state.initialState.permissions = action.payload;
    },
    [getPermissions.rejected]: (state ) => {
      state.initialState.loading = false;
    },
  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedPermissionGroupsSelectors = permissionGroupsAdapter.getSelectors((state) => state.permission);
