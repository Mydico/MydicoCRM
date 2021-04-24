import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {creatingUserRole, getUserRole, getDetailUserRole, updateUserRole} from './user-roles.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
};

export const userRoleAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (userRole) => userRole.id,
  // Keep the "all IDs" array sorted based on book titles
  // sortComparer: (a, b) => a.login.localeCompare(b.login),
});

const slice = createSlice({
  name: 'userRole',
  initialState: userRoleAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    userRoleAddOne: userRoleAdapter.addOne,
    userRoleAddMany: userRoleAdapter.addMany,
    userRoleUpdate: userRoleAdapter.updateOne,
    userRoleRemove: userRoleAdapter.removeOne,
  },
  extraReducers: {
    [creatingUserRole.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingUserRole.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateUserRole.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateUserRole.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailUserRole.fulfilled]: (state, action) => {
      userRoleAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getUserRole.fulfilled]: (state, action) => {
      userRoleAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getUserRole.rejected]: (state ) => {
      state.loading = false;
    },
  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedUserRoleSelectors = userRoleAdapter.getSelectors((state) => state.userRole);
