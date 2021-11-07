import { createSlice } from '@reduxjs/toolkit';
import { socket } from './App';

const initialState = {
  sidebarShow: 'responsive',
  asideShow: false,
  darkMode: false,
  params: {}
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
    }
  }
});

export default slice.reducer;

// Actions

export const { setAsideShow, setSidebarShow, setDarkMode, setToatsList, setParams } = slice.actions;
