import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {creatingStoreHistory, getStoreHistory, getDetailStoreHistory, updateStoreHistory} from './warehouse-history.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
};

export const storeHistorysAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (storeHistory) => storeHistory.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => {
    if (b.createdDate && a.createdDate) return b.createdDate.localeCompare(a.createdDate);
    return 1
  }
});

const slice = createSlice({
  name: 'storeHistory',
  initialState: storeHistorysAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    storeHistorysAddOne: storeHistorysAdapter.addOne,
    storeHistorysAddMany: storeHistorysAdapter.addMany,
    storeHistoryUpdate: storeHistorysAdapter.updateOne,
    storeHistoryRemove: storeHistorysAdapter.removeOne,
  },
  extraReducers: {
    [creatingStoreHistory.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateStoreHistory.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailStoreHistory.fulfilled]: (state, action) => {
      storeHistorysAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getStoreHistory.fulfilled]: (state, action) => {
      storeHistorysAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getStoreHistory.rejected]: (state ) => {
      state.loading = false;
    },
    [getStoreHistory.pending]: (state ) => {
      state.initialState.loading = true;
    },
  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedStoreHistorySelectors = storeHistorysAdapter.getSelectors((state) => state.storeHistory);
