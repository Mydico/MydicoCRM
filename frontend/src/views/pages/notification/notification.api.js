import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getInternalNotifications = createAsyncThunk('api/internalNotifications', async (params = { page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }, thunkAPI) => {
  try {
    const result = await axios.get('api/internal-notifications', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


export const getDetailInternalNotifications = createAsyncThunk('api/detail/internalNotifications', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/internal-notifications/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingInternalNotifications = createAsyncThunk('api/create/internal-notifications', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/internal-notifications', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateInternalNotifications = createAsyncThunk('api/update/internal-notifications', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/internal-notifications', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const deleteInternalNotifications = createAsyncThunk('api/delete/internal-notifications', async (params, thunkAPI) => {
  try {
    const result = await axios.delete('api/internal-notifications/' + params.id, { params: params });
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const send = createAsyncThunk('api/send/internal-notifications', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/internal-notifications/send', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const uploadFiles = createAsyncThunk('api/upload/file/internal-notifications', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/assets/many', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});