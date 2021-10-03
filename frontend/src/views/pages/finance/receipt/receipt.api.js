import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailReceipt = createAsyncThunk('api/detail/receipts', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/receipts/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingReceipt = createAsyncThunk('api/create/receipts', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/receipts', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateReceipt = createAsyncThunk('api/update/receipts', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/receipts', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateReceiptStatus = createAsyncThunk('api/update/receipts/status', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/receipts/' + body.action, body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getReceipt = createAsyncThunk('api/receipts', async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
  try {
    const result = await axios.get('api/receipts', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCountReceipt = createAsyncThunk('api/receipts/count', async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
  try {
    const result = await axios.get('api/receipts/count', { params: params });
    return { data: result.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});