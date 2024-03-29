import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createCustomerDebts, getCustomerDebts, getDetailTransaction, getTransaction, getTransactionListDetail } from './debt.api';

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
      state.initialState.transactions = [];
      debtAdapter.setAll(state, []);
    },
    debtAddOne: debtAdapter.addOne,
    debtAddMany: debtAdapter.addMany,
    debtUpdate: debtAdapter.updateOne,
    debtRemove: debtAdapter.removeOne
  },
  extraReducers: {
    [createCustomerDebts.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [createCustomerDebts.rejected]: (state ) => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getCustomerDebts.fulfilled]: (state, action) => {
      debtAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getCustomerDebts.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailTransaction.fulfilled]: (state, action) => {
      debtAdapter.addOne(state, action.payload);
      state.initialState.loading = false;
    },
    [getDetailTransaction.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getTransaction.fulfilled]: (state, action) => {
      state.initialState.transactions = action.payload.data.sort((a, b) => {
        if (b.createdDate && a.createdDate) return b.createdDate.localeCompare(a.createdDate);
        return 1;
      });
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getTransaction.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getTransactionListDetail.fulfilled]: (state, action) => {
      state.initialState.transactions = action.payload.data.sort((a, b) => {
        if (b.createdDate && a.createdDate) return b.createdDate.localeCompare(a.createdDate);
        return 1;
      });
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getTransactionListDetail.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    }
  }
});

export default slice.reducer;
export const { fetching, reset } = slice.actions;

export const globalizedDebtsSelectors = debtAdapter.getSelectors(state => state.debt);
