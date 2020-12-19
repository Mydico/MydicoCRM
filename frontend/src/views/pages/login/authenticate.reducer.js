import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Storage } from 'react-jhipster';
const AUTH_TOKEN_KEY = 'authenticationToken';

const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  account: {},
  errorMessage: null, // Errors returned from server side
  redirectMessage: null,
  sessionHasBeenFetched: false,
  idToken: null,
  logoutUrl: null,
};
export const login = createAsyncThunk('api/authenticate', async ({ username, password, rememberMe }, thunkAPI) => {
  try {
    const result = await axios.post('api/authenticate', {
      username,
      password,
      rememberMe,
    });
    const bearerToken = result.data.id_token;
    if (bearerToken) {
      const jwt = bearerToken;
      if (rememberMe) {
        Storage.local.set(AUTH_TOKEN_KEY, jwt);
      } else {
        Storage.session.set(AUTH_TOKEN_KEY, jwt);
      }
    }
    await thunkAPI.dispatch(getSession());
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getSession = createAsyncThunk('api/account', async thunkAPI => {
  try {
    const accountResponse = await axios.get('api/account');
    return accountResponse.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const slice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    request: (state, action) => {
      state.loading = true;
      state.errorMessage = null;
    },
    logout: (state, action) => {
      state = initialState;
    },
    clearAuthToken: () => {
      if (Storage.local.get(AUTH_TOKEN_KEY)) {
        Storage.local.remove(AUTH_TOKEN_KEY);
      }
      if (Storage.session.get(AUTH_TOKEN_KEY)) {
        Storage.session.remove(AUTH_TOKEN_KEY);
      }
    },
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [login.fulfilled]: (state, action) => {
      state.loginSuccess = true;
      state.loading = false;
      state.loginError = false;
    },
    [getSession.fulfilled]: (state, action) => {
      const isAuthenticated = action.payload && action.payload.activated;
      state.account = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.loading = false;
      state.sessionHasBeenFetched = true;
    },
    [login.rejected]: (state, action) => {
      state.loginError = action.payload.statusCode;
      state.errorMessage = action.payload.message;
    },
  },
});

export default slice.reducer;

// Actions

const { request, logout, clearAuthToken } = slice.actions;

// export const login = (username, password, rememberMe = false) => async (
//   dispatch,
//   getState
// ) => {
//   const result = await dispatch({
//     type: ACTION_TYPES.LOGIN,
//     payload: axios.post("api/authenticate", { username, password, rememberMe }),
//   });
//   const bearerToken = result.value.headers.authorization;
//   if (bearerToken && bearerToken.slice(0, 7) === "Bearer ") {
//     const jwt = bearerToken.slice(7, bearerToken.length);
//     if (rememberMe) {
//       Storage.local.set(AUTH_TOKEN_KEY, jwt);
//     } else {
//       Storage.session.set(AUTH_TOKEN_KEY, jwt);
//     }
//   }
//   await dispatch(getSession());
// };
