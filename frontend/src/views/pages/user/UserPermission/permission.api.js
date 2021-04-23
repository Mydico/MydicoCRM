import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getPermissionGroups = createAsyncThunk(
  'api/permission-groups',
  async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
    try {
      const result = await axios.get('api/permission-groups', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getDetailPermissionGroups = createAsyncThunk('api/detail/permission-groups', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/permission-groups/' + userId);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingPermissionGroups = createAsyncThunk('api/create/permission-groups', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/permission-groups', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updatePermissionGroups = createAsyncThunk('api/update/permission-groups', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/permission-groups', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getPermissionType = createAsyncThunk(
  'api/get/permission-type',
  async (params = { page: 0, size: 200, sort: 'createdDate,desc', status: 'ACTIVE' }, thunkAPI) => {
    try {
      const result = await axios.get('api/permission-types', { params: params });
      return result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getPermissions = createAsyncThunk(
  'api/get/permission',
  async (params = { page: 0, size: 200, sort: 'createdDate,desc', status: 'PUBLIC' }, thunkAPI) => {
    try {
      const result = await axios.get('api/permissions', { params: params });
      return result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
