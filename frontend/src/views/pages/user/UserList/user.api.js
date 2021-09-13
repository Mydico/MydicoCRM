import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getUser = createAsyncThunk('api/users', async (params = { page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }, thunkAPI) => {
  try {
    const result = await axios.get('api/users', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getExactUser = createAsyncThunk('api/users/exact', async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
  try {
    const result = await axios.get('api/users/find/exact', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getTranporter = createAsyncThunk(
  'api/users/transporter',
  async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
    try {
      const result = await axios.get('api/users/transporter', { params: params });
      return { data: result.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailUser = createAsyncThunk('api/detail/users', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/users/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingUser = createAsyncThunk('api/create/users', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/users', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateUser = createAsyncThunk('api/update/users', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/users', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateUserInfo = createAsyncThunk('api/update/users/info', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/users/change-info', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const changePassword = createAsyncThunk('api/changePassword/users', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/users/change-password', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


export const resetPassword = createAsyncThunk('api/resetPassword/users', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/users/reset-password', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const uploadImage = createAsyncThunk('api/files/upload', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/files', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});