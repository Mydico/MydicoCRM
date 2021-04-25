import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getUserRole = createAsyncThunk(
    'api/user-roles',
    async (params = {page: 0, size: 20, sort: 'createdDate,desc'}, thunkAPI) => {
      try {
        const result = await axios.get('api/user-roles', {params: params});
        return {data: result.data, total: result.headers['x-total-count']};
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    },
);

export const getDetailUserRole = createAsyncThunk('api/detail/user-roles', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/user-roles/' + userId);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingUserRole = createAsyncThunk('api/create/user-roles', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/user-roles', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateUserRole = createAsyncThunk('api/update/user-roles', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/user-roles', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
