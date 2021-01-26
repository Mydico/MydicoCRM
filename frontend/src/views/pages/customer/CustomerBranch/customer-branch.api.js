import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailBranch = createAsyncThunk('api/detail/customers-branch', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/branches/'+ userId);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingBranch = createAsyncThunk('api/create/customers-branch', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/branches', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateBranch = createAsyncThunk('api/create/customers-branch', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/branches', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getBranch = createAsyncThunk('api/branches', async (params = { page: 0, size: 20, sort: 'name,asc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/branches', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


