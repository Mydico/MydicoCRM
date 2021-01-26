import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { getBranch, getDetailBranch, updateBranch, creatingBranch } from './customer-branch.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
};

export const branchAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: branch => branch.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const slice = createSlice({
  name: 'branch',
  initialState: branchAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true
    },
    reset(state) {
      state.initialState.loading = false
      state.initialState.updatingSuccess = false
    },
    branchAddOne: branchAdapter.addOne,
    branchAddMany: branchAdapter.addMany,
    branchUpdate: branchAdapter.updateOne,
    branchRemove: branchAdapter.removeOne,
  },
  extraReducers: {
    [creatingBranch.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailBranch.fulfilled]: (state, action) => {
      branchAdapter.addOne(state, action.payload)
      state.initialState.loading = false;
    },
    [getBranch.fulfilled]: (state, action) => {
      branchAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total
      state.initialState.loading = false;
    },
    [updateBranch.fulfilled]: (state, action) => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
  },
});

export default slice.reducer;
export const { fetching, reset } = slice.actions

export const globalizedbranchelectors = branchAdapter.getSelectors(state => state.branch);