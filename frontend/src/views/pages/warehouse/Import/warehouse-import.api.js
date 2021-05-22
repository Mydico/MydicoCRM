import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWarehouseImport = createAsyncThunk(
  'api/store-inputs',
  async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
    try {
      const result = await axios.get('api/store-inputs', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getWarehouseExport = createAsyncThunk(
  'api/store-inputs/export',
  async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
    try {
      const result = await axios.get('api/store-inputs/export', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailWarehouseImport = createAsyncThunk('api/detail/store-inputs', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/store-inputs/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingWarehouseImport = createAsyncThunk('api/create/store-inputs', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/store-inputs', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateWarehouseImport = createAsyncThunk('api/update/store-inputs', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/store-inputs', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateWarehouseStatusImport = createAsyncThunk('api/update/store-inputs', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/store-inputs/status', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
