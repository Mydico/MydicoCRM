import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {
  creatingPromotion,


  getPromotion,


  getDetailPromotion,


  updatePromotion,
  getPromotionProduct,
  getDetailProductPromotion,
} from './promotion.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
  products: [],
  promotionProducts: [],
};

export const promotionsAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (promotion) => promotion.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => b.createdDate.localeCompare(a.createdDate),
});

const slice = createSlice({
  name: 'promotion',
  initialState: promotionsAdapter.getInitialState({initialState}),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState = initialState;
    },
    promotionsAddOne: promotionsAdapter.addOne,
    promotionsAddMany: promotionsAdapter.addMany,
    promotionUpdate: promotionsAdapter.updateOne,
    promotionRemove: promotionsAdapter.removeOne,
  },
  extraReducers: {
    [creatingPromotion.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingPromotion.rejected]: state => {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = true;
    },
    [updatePromotion.fulfilled]: (state ) => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updatePromotion.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailPromotion.fulfilled]: (state, action) => {
      promotionsAdapter.setAll(state, [action.payload]);
      state.initialState.loading = false;
    },
    [getPromotion.fulfilled]: (state, action) => {
      promotionsAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getPromotionProduct.fulfilled]: (state, action) => {
      state.initialState.products = action.payload;
      state.initialState.loading = false;
    },
    [getDetailProductPromotion.fulfilled]: (state, action) => {
      state.initialState.promotionProducts = action.payload;
      state.initialState.loading = false;
    },
    [getPromotion.rejected]: (state ) => {
      state.loading = false;
    },
  },
});

export default slice.reducer;
export const {fetching, reset} = slice.actions;

export const globalizedPromotionSelectors = promotionsAdapter.getSelectors((state) => state.promotion);
