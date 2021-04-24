import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {creatingProductGroup} from './product-group.api';
import {getProductGroup, getDetailProductGroup, updateProductGroup} from './product-group.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
};

export const productGroupsAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (productGroups) => productGroups.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const slice = createSlice({
  name: 'productGroups',
  initialState: productGroupsAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    productGroupsAddOne: productGroupsAdapter.addOne,
    productGroupsAddMany: productGroupsAdapter.addMany,
    productGroupsUpdate: productGroupsAdapter.updateOne,
    productGroupsRemove: productGroupsAdapter.removeOne,
  },
  extraReducers: {
    [creatingProductGroup.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [getDetailProductGroup.fulfilled]: (state, action) => {
      productGroupsAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getProductGroup.fulfilled]: (state, action) => {
      productGroupsAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [updateProductGroup.fulfilled]: (state ) => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedproductGroupsSelectors = productGroupsAdapter.getSelectors((state) => state.productGroup);
