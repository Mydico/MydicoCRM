import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { creatingSyllabus, getSyllabus, getDetailSyllabus, updateSyllabus } from './syllabus.api';

const initialState = {
  loading: false,
  updatingSuccess: false,
  totalItem: 0,
};

export const syllabusAdapter = createEntityAdapter({
  // Assume IDs are stored in a field other than `book.id`
  selectId: syllabus => syllabus.id,
  // Keep the "all IDs" array sorted based on book titles
  // sortComparer: (a, b) => a.id < b.id,
});

const slice = createSlice({
  name: 'syllabus',
  initialState: syllabusAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    reset(state) {
      state.initialState.loading = false;
      state.initialState.updatingSuccess = false;
    },
    syllabusAddOne: syllabusAdapter.addOne,
    syllabusAddMany: syllabusAdapter.addMany,
    syllabusUpdate: syllabusAdapter.updateOne,
    syllabusRemove: syllabusAdapter.removeOne
  },
  extraReducers: {
    [creatingSyllabus.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [creatingSyllabus.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [updateSyllabus.fulfilled]: state => {
      state.initialState.updatingSuccess = true;
      state.initialState.loading = false;
    },
    [updateSyllabus.rejected]: state => {
      state.initialState.updatingSuccess = false;
      state.initialState.loading = false;
    },
    [getDetailSyllabus.fulfilled]: (state, action) => {
      state.initialState.detail = action.payload;
      state.initialState.loading = false;
    },
    [getSyllabus.fulfilled]: (state, action) => {
      syllabusAdapter.setAll(state, action.payload.data);
      state.initialState.totalItem = action.payload.total;
      state.initialState.loading = false;
    },
    [getSyllabus.rejected]: state => {
      state.loading = false;
    },

  }
});

export default slice.reducer;
export const { fetching, reset } = slice.actions;

export const globalizedSyllabusSelectors = syllabusAdapter.getSelectors(state => state.syllabus);
