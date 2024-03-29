import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {creatingUser, getUser, getDetailUser, updateUser, getTranporter, changePassword, updateUserInfo, getExactUser} from './user.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
};

export const usersAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (user) => user.login,
  // Keep the "all IDs" array sorted based on book titles
  // sortComparer: (a, b) => a.login.localeCompare(b.login),
});

const slice = createSlice({
  name: 'user',
  initialState: usersAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    usersAddOne: usersAdapter.addOne,
    usersAddMany: usersAdapter.addMany,
    userUpdate: usersAdapter.updateOne,
    userRemove: usersAdapter.removeOne,
  },
  extraReducers: {
    [creatingUser.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingUser.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateUser.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [changePassword.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [changePassword.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateUserInfo.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateUserInfo.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateUser.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailUser.fulfilled]: (state, action) => {
      usersAdapter.setAll(state, [action.payload]);
      state.initialState.loading = false;
    },
    [getUser.fulfilled]: (state, action) => {
      usersAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getUser.rejected]: (state ) => {
      state.initialState.loading = false;
    },
    [getExactUser.fulfilled]: (state, action) => {
      usersAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getExactUser.rejected]: (state ) => {
      state.initialState.loading = false;
    },
    [getTranporter.fulfilled]: (state, action) => {
      usersAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getTranporter.rejected]: (state ) => {
      state.initialState.loading = false;
    },
  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedUserSelectors = usersAdapter.getSelectors((state) => state.user);
