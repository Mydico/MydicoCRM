import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { creatingPromotion, creatingPromotionStatus, creatingPromotionType, getBranches, getCity, getPromotion, getPromotionBirthday, getPromotionStatus, getPromotionType, getDetailPromotion, getDistrict, getWard, updatePromotion } from './promotion.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
};

export const promotionsAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: promotion => promotion.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const slice = createSlice({
  name: 'promotion',
  initialState: promotionsAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true
    },
    reset(state) {
      state.initialState.loading = false
      state.initialState.updatingSuccess = false
    },
    promotionsAddOne: promotionsAdapter.addOne,
    promotionsAddMany: promotionsAdapter.addMany,
    promotionUpdate: promotionsAdapter.updateOne,
    promotionRemove: promotionsAdapter.removeOne,
  },
  extraReducers: {
    [creatingPromotion.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updatePromotion.fulfilled]: (state, action) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updatePromotion.rejected]: (state, action) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailPromotion.fulfilled]: (state, action) => {
      promotionsAdapter.addOne(state, action.payload)
      state.initialState.loading = false;
    },
    [getPromotion.fulfilled]: (state, action) => {
      promotionsAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total
      state.initialState.loading = false;
    },
    [getPromotion.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export default slice.reducer;
export const { fetching, reset } = slice.actions

export const globalizedPromotionSelectors = promotionsAdapter.getSelectors(state => state.promotion);
