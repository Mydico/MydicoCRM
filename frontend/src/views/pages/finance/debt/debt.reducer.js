import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { creatingDebt, creatingTransaction, getCustomerDebts, getDebtDetail, getDetailTransaction, getTransaction } from './debt.api';
import { getDebt, getDetailDebt, updateDebt } from './debt.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  debtDetails: [],
  transactions: []
};

export const debtAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: debt => debt.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => b.createdDate.localeCompare(a.createdDate),
});

const slice = createSlice({
  name: 'debt',
  initialState: debtAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    debtAddOne: debtAdapter.addOne,
    debtAddMany: debtAdapter.addMany,
    debtUpdate: debtAdapter.updateOne,
    debtRemove: debtAdapter.removeOne,
  },
  extraReducers: {
    [getCustomerDebts.fulfilled]: (state, action) => {
      debtAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getCustomerDebts.rejected]: (state, action) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailTransaction.fulfilled]: (state, action) => {
      debtAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getDetailTransaction.rejected]: (state, action) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getTransaction.fulfilled]: (state, action) => {
      state.initialState.transactions = action.payload.data
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getTransaction.rejected]: (state, action) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
  },
});

export default slice.reducer;
export const { fetching, reset } = slice.actions;

export const globalizedDebtsSelectors = debtAdapter.getSelectors(state => state.debt);
