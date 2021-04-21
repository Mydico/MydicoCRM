import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailProductGroup = createAsyncThunk('api/detail/product-groups', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/product-groups/' + userId);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingProductGroup = createAsyncThunk('api/create/product-groups', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/product-groups', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateProductGroup = createAsyncThunk('api/update/product-groups', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/product-groups', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getProductGroup = createAsyncThunk(
  'api/product-groups',
  async (params = { page: 0, size: 20, sort: 'name,asc' }, thunkAPI) => {
    try {
      const result = await axios.get('api/product-groups', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
