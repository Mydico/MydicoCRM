import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProductWarehouse = createAsyncThunk('api/product-quantities', async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/product-quantities', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


export const getDetailProductWarehouse = createAsyncThunk('api/detail/product-quantities', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/product-quantities/'+ userId);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingProductWarehouse = createAsyncThunk('api/create/product-quantities', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/product-quantities', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateProductWarehouse = createAsyncThunk('api/update/product-quantities', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/product-quantities', body);
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
