import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailCustomerStatus = createAsyncThunk('api/detail/customers-status', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/customer-statuses/'+ userId);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingCustomerStatus = createAsyncThunk('api/create/customers-status', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/customer-statuses', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateCustomerStatus = createAsyncThunk('api/create/customers-status', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/customer-statuses', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCustomerStatus = createAsyncThunk('api/customer-statuses', async (params = { page: 0, size: 20, sort: 'name,asc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/customer-statuses', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


