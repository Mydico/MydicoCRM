import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDetailBill = createAsyncThunk('api/detail/bills', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/bills/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingBill = createAsyncThunk('api/create/bills', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/bills', body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateBill = createAsyncThunk('api/update/bills', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/bills/' + body.action, body);
    return { data: result.data, headers: result.headers, statusCode: result.status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getBillDetail = createAsyncThunk('api/get/bill-detail', async (billId, thunkAPI) => {
  try {
    const result = await axios.get('api/bill-details/bill', { params: { billId } });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getBill = createAsyncThunk('api/bills', async (params = { page: 0, size: 20, sort: 'createdDate,DESC' }, thunkAPI) => {
  try {
    const result = await axios.get('api/bills', { params: params });
    return { data: result.data, total: result.headers['x-total-count'] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
