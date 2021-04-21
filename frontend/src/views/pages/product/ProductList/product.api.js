import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProduct = createAsyncThunk('api/products', async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/products', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getProductBirthday = createAsyncThunk(
  'api/products/birthday',
  async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
    try {
      const result = await axios.get('api/products/birthday', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailProduct = createAsyncThunk('api/detail/products', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/products/' + userId);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingProduct = createAsyncThunk('api/create/products', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/products', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateProduct = createAsyncThunk('api/update/products', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/products', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingProductType = createAsyncThunk('api/create/products-type', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/product-types', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingProductStatus = createAsyncThunk('api/create/products-status', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/product-statuses', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCity = createAsyncThunk('api/cities', async (params = { page: 0, size: 100, sort: 'code,asc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/cities', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getDistrict = createAsyncThunk('api/districts', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/districts', { params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getWard = createAsyncThunk('api/wards', async (params = { page: 0, size: 20, sort: 'code,asc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/wards', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getProductType = createAsyncThunk(
  'api/product/product-types',
  async (params = { page: 0, size: 20, sort: 'name,asc' }, thunkAPI) => {
    try {
      const result = await axios.get('api/product-types', { params: params });
      return result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getProductStatus = createAsyncThunk(
  'api/product/product-statuses',
  async (params = { page: 0, size: 20, sort: 'name,asc' }, thunkAPI) => {
    try {
      const result = await axios.get('api/product-statuses', { params: params });
      return result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getBranches = createAsyncThunk('api/product/branches', async (params = { page: 0, size: 20, sort: 'name,asc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/branches', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
