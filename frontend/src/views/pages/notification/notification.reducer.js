import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {creatingInternalNotifications, getInternalNotifications, getDetailInternalNotifications, updateInternalNotifications} from './notification.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
};

export const internalNotificationsAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (internalNotification) => internalNotification.id,
  // Keep the "all IDs" array sorted based on book titles
  // sortComparer: (a, b) => a.login.localeCompare(b.login),
});

const slice = createSlice({
  name: 'internalNotification',
  initialState: internalNotificationsAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    internalNotificationsAddOne: internalNotificationsAdapter.addOne,
    internalNotificationsAddMany: internalNotificationsAdapter.addMany,
    internalNotificationUpdate: internalNotificationsAdapter.updateOne,
    internalNotificationRemove: internalNotificationsAdapter.removeOne,
  },
  extraReducers: {
    [creatingInternalNotifications.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingInternalNotifications.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateInternalNotifications.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },

    [updateInternalNotifications.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailInternalNotifications.fulfilled]: (state, action) => {
      internalNotificationsAdapter.setAll(state, [action.payload]);
      state.initialState.loading = false;
    },
    [getInternalNotifications.fulfilled]: (state, action) => {
      internalNotificationsAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getInternalNotifications.rejected]: (state ) => {
      state.initialState.loading = false;
    },

  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedInternalNotificationsSelectors = internalNotificationsAdapter.getSelectors((state) => state.internalNotification);
