import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDepartment = createAsyncThunk(
  'api/departments',
  async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
    try {
      const result = await axios.get('api/departments', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getTreeDepartment = createAsyncThunk('api/departments/tree', async thunkAPI => {
  try {
    const result = await axios.get('api/departments/tree');
    return { data: result.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getChildTreeDepartmentByUser = createAsyncThunk(
  'api/departments/childtree/byuser',
  async (params = { dependency: true }, thunkAPI) => {
    try {
      const result = await axios.get('api/departments/allchild/byuser', { params: params });
      return { data: result.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getChildTreeDepartment = createAsyncThunk('api/departments/childtree', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/departments/allchild/' + params.id);
    return { data: result.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getDetailDepartment = createAsyncThunk('api/detail/departments', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/departments/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingDepartment = createAsyncThunk('api/create/departments', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/departments', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateDepartment = createAsyncThunk('api/update/departments', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/departments', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
