import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {creatingProvider, getProvider, getDetailProvider, updateProvider} from './provider.api';

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

export const providersAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (provider) => provider.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const slice = createSlice({
  name: 'provider',
  initialState: providersAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    providersAddOne: providersAdapter.addOne,
    providersAddMany: providersAdapter.addMany,
    providerUpdate: providersAdapter.updateOne,
    providerRemove: providersAdapter.removeOne,
  },
  extraReducers: {
    [creatingProvider.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateProvider.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailProvider.fulfilled]: (state, action) => {
      providersAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getProvider.fulfilled]: (state, action) => {
      providersAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getProvider.rejected]: (state ) => {
      state.loading = false;
    },
  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedProviderSelectors = providersAdapter.getSelectors((state) => state.provider);
