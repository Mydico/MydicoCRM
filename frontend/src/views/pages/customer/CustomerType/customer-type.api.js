import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailCustomerType = createAsyncThunk('api/detail/customers-types', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/customer-types/'+ userId);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingCustomerType = createAsyncThunk('api/create/customers-types', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/customer-types', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateCustomerType = createAsyncThunk('api/create/customers-types', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/customer-types', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCustomerType = createAsyncThunk('api/customer-types', async (params = { page: 0, size: 20, sort: 'name,asc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/customer-types', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


