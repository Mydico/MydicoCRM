import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { creatingQuestion, getQuestion, getDetailQuestion, updateQuestion, deleteQuestion } from './question.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
};

export const questionAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: question => question.id,
  // Keep the "all IDs" array sorted based on book titles
  // sortComparer: (a, b) => a.id < b.id,
});

const slice = createSlice({
  name: 'question',
  initialState: questionAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    questionAddOne: questionAdapter.addOne,
    questionAddMany: questionAdapter.addMany,
    questionUpdate: questionAdapter.updateOne,
    questionRemove: questionAdapter.removeOne
  },
  extraReducers: {
    [creatingQuestion.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingQuestion.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateQuestion.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateQuestion.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [deleteQuestion.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [deleteQuestion.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailQuestion.fulfilled]: (state, action) => {
      state.initialState.detail = action.payload;
      state.initialState.loading = false;
    },
    [getQuestion.fulfilled]: (state, action) => {
      questionAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getQuestion.rejected]: state => {
      state.loading = false;
    },

  }
});

export default slice.reducer;
export const { fetching, reset } = slice.actions;

export const globalizedQuestionSelectors = questionAdapter.getSelectors(state => state.question);
