import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailOrder = createAsyncThunk('api/detail/orders', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/orders/'+ userId);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingOrder = createAsyncThunk('api/create/orders', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/orders', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateOrder = createAsyncThunk('api/create/orders', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/orders', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getOrder = createAsyncThunk('api/orders', async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/orders', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

