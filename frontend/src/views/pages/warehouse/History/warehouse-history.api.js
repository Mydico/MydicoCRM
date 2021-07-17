import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getStoreHistory = createAsyncThunk(
    'api/store-histories',
    async (params = {page: 0, size: 50, sort: 'createdDate,DESC'}, thunkAPI) => {
      try {
        const result = await axios.get('api/store-histories', {params: params});
        return {data: result.data, total: result.headers['x-total-count']};
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    },
);

export const getDetailStoreHistory = createAsyncThunk('api/detail/store-histories', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/store-histories/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingStoreHistory = createAsyncThunk('api/create/store-histories', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/store-histories', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateStoreHistory = createAsyncThunk('api/update/store-histories', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/store-histories', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
