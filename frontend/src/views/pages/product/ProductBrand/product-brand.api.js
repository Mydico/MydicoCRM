import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailProductBrand = createAsyncThunk('api/detail/product-brands', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/product-brands/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingProductBrand = createAsyncThunk('api/create/product-brands', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/product-brands', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateProductBrand = createAsyncThunk('api/update/product-brands', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/product-brands', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getProductBrand = createAsyncThunk(
    'api/product-brands',
    async (params = {page: 0, size: 20, sort: 'name,asc'}, thunkAPI) => {
      try {
        const result = await axios.get('api/product-brands', {params: params});
        return {data: result.data, total: result.headers['x-total-count']};
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    },
);
