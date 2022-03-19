import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
  sidebarShow: 'responsive',
  asideShow: false,
  darkMode: false,
  params: {},
  reportDate: { startDate: moment().startOf('month').format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD') }
};
const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAsideShow: (state, action) => {
      state.asideShow = action.payload;
    },
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    setParams: (state, action) => {
      state.params = action.payload;
    },
    setReportDate: (state, action) => {
      state.reportDate = action.payload;
    }
  }
});

export default slice.reducer;

// Actions

export const { setAsideShow, setSidebarShow, setDarkMode, setToatsList, setParams, setReportDate } = slice.actions;
