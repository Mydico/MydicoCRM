import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailTransaction = createAsyncThunk('api/detail/transactions', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/transactions/' + params.id, { params: params });
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

export const getTransaction = createAsyncThunk(
  'api/transactions',
  async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
    try {
      const result = await axios.get('api/transactions', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getTransactionListDetail = createAsyncThunk(
  'api/transactions/detail',
  async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
    try {
      const result = await axios.get('api/transactions/find', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getCustomerDebts = createAsyncThunk(
  'api/customer-debits',
  async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
    try {
      const result = await axios.get('api/transactions', { params: params });
      return { data: result.data, total: result.headers['x-total-count'] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createCustomerDebts = createAsyncThunk('api/customer-debits/create', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/transactions', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const mockTransfer = createAsyncThunk('api/customers/many', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/customers/many', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCustomerDebtsTotalDebit = createAsyncThunk('api/customer-debits/total-debit', async (params = {}, thunkAPI) => {
  try {
    const result = await axios.get('api/transactions/total-debit', { params: params });
    return { data: result.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCustomerTotalDebit = createAsyncThunk('api/customer-debits/total-debit', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/transactions/debt/' + params.id);
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
