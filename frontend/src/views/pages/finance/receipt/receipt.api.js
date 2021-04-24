import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailReceipt = createAsyncThunk('api/detail/receipts', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/receipts/' + userId);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingReceipt = createAsyncThunk('api/create/receipts', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/receipts', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateReceipt = createAsyncThunk('api/update/receipts', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/receipts', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getReceipt = createAsyncThunk('api/receipts', async (params = {page: 0, size: 20, sort: 'createdDate,desc'}, thunkAPI) => {
  try {
    const result = await axios.get('api/receipts', {params: params});
    return {data: result.data, total: result.headers['x-total-count']};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
