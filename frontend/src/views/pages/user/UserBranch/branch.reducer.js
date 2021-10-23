import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { creatingBranch, getBranch, getDetailBranch, getTreeBranch, updateBranch } from './branch.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
  treeBranchs: [],
  detail: null
};

export const branchAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: branch => branch.id
  // Keep the "all IDs" array sorted based on book titles
  // sortComparer: (a, b) => a.login.localeCompare(b.login),
});

const slice = createSlice({
  name: 'branch',
  initialState: branchAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    branchAddOne: branchAdapter.addOne,
    branchAddMany: branchAdapter.addMany,
    branchUpdate: branchAdapter.updateOne,
    branchRemove: branchAdapter.removeOne,
    setAll: branchAdapter.setAll
  },
  extraReducers: {
    [creatingBranch.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingBranch.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateBranch.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateBranch.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailBranch.fulfilled]: (state, action) => {
      state.initialState.detail = action.payload;
      state.initialState.loading = false;
    },
    [getBranch.fulfilled]: (state, action) => {
      branchAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getBranch.rejected]: state => {
      state.loading = false;
    }
  }
});

export default slice.reducer;
export const { fetching, reset, branchRemove, setAll } = slice.actions;

export const globalizedBranchSelectors = branchAdapter.getSelectors(state => state.branch);
