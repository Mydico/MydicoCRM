import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  sidebarShow: 'responsive',
  asideShow: false,
  darkMode: false,
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
  },
});

export default slice.reducer;

// Actions

export const {setAsideShow, setSidebarShow, setDarkMode} = slice.actions;
