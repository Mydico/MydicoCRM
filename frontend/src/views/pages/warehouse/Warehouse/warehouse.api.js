import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWarehouse = createAsyncThunk('api/stores', async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
  try {
    const result = await axios.get('api/stores', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getAllWarehouse = createAsyncThunk(
  'api/all-stores',
  async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
    try {
      const result = await axios.get('api/stores/all', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailWarehouse = createAsyncThunk('api/detail/stores', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/stores/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingWarehouse = createAsyncThunk('api/create/stores', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/stores', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateWarehouse = createAsyncThunk('api/update/stores', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/stores', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
