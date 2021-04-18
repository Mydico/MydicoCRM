import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailTransaction = createAsyncThunk('api/detail/transactions', async (userId, thunkAPI) => {
  try {
    const result = await axios.get('api/transactions/' + userId);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingTransaction = createAsyncThunk('api/create/transactions', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/transactions', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateTransaction = createAsyncThunk('api/update/transactions', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/transactions', body);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getTransactionDetail = createAsyncThunk('api/get/transaction-detail', async (transactionId, thunkAPI) => {
  try {
    const result = await axios.get('api/transaction-details/transaction', { params: { transactionId } });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getTransaction = createAsyncThunk('api/transactions', async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/transactions', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getCustomerDebts = createAsyncThunk('api/customer-debits', async (params = { page: 0, size: 20, sort: 'createdDate,desc' }, thunkAPI) => {
  try {
    const result = await axios.get('api/customer-debits', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
