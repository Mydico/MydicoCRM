import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarShow: 'responsive',
  asideShow: false,
  sidebarShow: true,
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
      state.asideShow = action.payload;
    },
  },
});

export default slice.reducer;

// Actions

export const { setAsideShow, setSidebarShow} = slice.actions;
