import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDepartment = createAsyncThunk('api/departments', async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/departments', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


export const getDetailDepartment = createAsyncThunk('api/detail/departments', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/departments/'+ userId);
    console.log(result)
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingDepartment = createAsyncThunk('api/create/departments', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/departments', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateDepartment = createAsyncThunk('api/update/departments', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/departments', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
