import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getBranch = createAsyncThunk(
    'api/branches',
    async (params = {page: 0, size: 50, sort: 'createdDate,DESC'}, thunkAPI) => {
      try {
        const result = await axios.get('api/branches', {params: params});
        return {data: result.data, total: result.headers['x-total-count']};
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    },
);
export const getDetailBranch = createAsyncThunk('api/detail/branches', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/branches/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingBranch = createAsyncThunk('api/create/branches', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/branches', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateBranch = createAsyncThunk('api/update/branches', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/branches', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
