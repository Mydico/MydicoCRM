import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getPromotion = createAsyncThunk(
  'api/promotions',
  async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
    try {
      const result = await axios.get('api/promotions', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getDetailPromotion = createAsyncThunk('api/detail/promotions', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/promotions/' + userId);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getDetailProductPromotion = createAsyncThunk('api/detail/product-promotions', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/promotion-products/', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getPromotionProduct = createAsyncThunk('api/product/promotions', async (ids, thunkAPI) => {
  try {
    const result = await axios.get('api/promotion-products/many', { params: { ids: JSON.stringify(ids) } });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingPromotion = createAsyncThunk('api/create/promotions', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/promotions', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updatePromotion = createAsyncThunk('api/update/promotions', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/promotions', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
