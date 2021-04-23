import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProvider = createAsyncThunk('api/providers', async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
  try {
    console.log(params);
    const result = await axios.get('api/providers', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getDetailProvider = createAsyncThunk('api/detail/providers', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/providers/' + userId);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingProvider = createAsyncThunk('api/create/providers', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/providers', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateProvider = createAsyncThunk('api/update/providers', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/providers', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
