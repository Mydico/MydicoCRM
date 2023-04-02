import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getSyllabus = createAsyncThunk(
  'api/syllabus',
  async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
    try {
      const result = await axios.get('api/syllabus', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailSyllabus = createAsyncThunk('api/detail/syllabus', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/syllabus/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingSyllabus = createAsyncThunk('api/create/syllabus', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/syllabus', body);
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

export const updateSyllabus = createAsyncThunk('api/update/syllabus', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/syllabus', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
