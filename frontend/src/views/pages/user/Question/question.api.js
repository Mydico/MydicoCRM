import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getQuestion = createAsyncThunk(
  'api/questions',
  async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
    try {
      const result = await axios.get('api/questions', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailQuestion = createAsyncThunk('api/detail/questions', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/questions/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingQuestion = createAsyncThunk('api/create/questions', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/questions', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingChoices = createAsyncThunk('api/create/choices', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/choices/many', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateQuestion = createAsyncThunk('api/update/questions', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/questions', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
