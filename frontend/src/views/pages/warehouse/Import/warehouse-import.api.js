import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWarehouseImport = createAsyncThunk(
  'api/store-inputs',
  async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
    try {
      const result = await axios.get('api/store-inputs', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getWarehouseReturn = createAsyncThunk(
  'api/store-inputs/return',
  async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
    try {
      const result = await axios.get('api/store-inputs/return', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getWarehouseExport = createAsyncThunk(
  'api/store-inputs/export',
  async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
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
export const getDetailWarehouseDirect = createAsyncThunk('api/detail/Warehouse/direct', async (params, thunkAPI) => {
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

export const creatingWarehouseExport = createAsyncThunk('api/create/store-inputs/export', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/store-inputs/export', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const creatingWarehouseReturn = createAsyncThunk('api/create/store-inputs/export', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/store-inputs/return', body);
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

export const updateWarehouseExport = createAsyncThunk('api/update/store-inputs/export', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/store-inputs/export', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateWarehouseReturn = createAsyncThunk('api/update/store-inputs/return', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/store-inputs/return', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateCurrentWarehouseReturn = createAsyncThunk('api/update/store-inputs/return/update', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/store-inputs/return/update?dependency=true', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateWarehouseStatusImport = createAsyncThunk('api/update/store-inputs/status', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/store-inputs/' + body.action, body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
