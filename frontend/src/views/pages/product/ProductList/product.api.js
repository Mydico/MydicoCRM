import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProduct = createAsyncThunk('api/products', async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
  try {
    const result = await axios.get('api/products', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const filterProduct = createAsyncThunk('api/products/find', async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
  try {
    const result = await axios.get('api/products/find', { params: params });
    return { data: result.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getDetailProduct = createAsyncThunk('api/detail/products', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/products/' + params.id, { params: params });
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