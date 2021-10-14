import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailOrder = createAsyncThunk('api/detail/orders', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/orders/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingOrder = createAsyncThunk('api/create/orders', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/orders', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateOrder = createAsyncThunk('api/update/orders', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/orders', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const editSelfOrder = createAsyncThunk('api/update/orders', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/orders/self-edit', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateStatusOrder = createAsyncThunk('api/update/orders/status', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/orders/' + body.action, body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getOrderDetail = createAsyncThunk('api/get/order-detail', async (orderId, thunkAPI) => {
  try {
    const result = await axios.get('api/order-details/order', { params: orderId });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getOrder = createAsyncThunk('api/orders', async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
  try {
    const result = await axios.get('api/orders', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getOrderwithproduct = createAsyncThunk('api/reports/orderwithproduct', async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/orderwithproduct', { params: params });
    return { data: result.data[0], total:result.data[1] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


