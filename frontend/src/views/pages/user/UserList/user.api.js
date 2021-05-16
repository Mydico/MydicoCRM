import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getUser = createAsyncThunk('api/users', async (params = {page: 0, size: 20, sort: 'createdDate,desc'}, thunkAPI) => {
  try {
    const result = await axios.get('api/users', {params: params});
    return {data: result.data, total: result.headers['x-total-count']};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getDetailUser = createAsyncThunk('api/detail/users', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/users/' + userId);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingUser = createAsyncThunk('api/create/users', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/users', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateUser = createAsyncThunk('api/update/users', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/users', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
