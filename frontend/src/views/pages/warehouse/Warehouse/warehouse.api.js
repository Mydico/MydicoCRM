import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWarehouse = createAsyncThunk('api/stores', async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/stores', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


export const getDetailWarehouse = createAsyncThunk('api/detail/stores', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/stores/'+ userId);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingWarehouse = createAsyncThunk('api/create/stores', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/stores', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateWarehouse = createAsyncThunk('api/update/stores', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/stores', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
