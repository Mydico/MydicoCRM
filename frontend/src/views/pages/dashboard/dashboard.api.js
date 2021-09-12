import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getIncomeDashboard = createAsyncThunk('api/income-dashboards', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/income-dashboards', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getSumIncomeDashboard = createAsyncThunk('api/income-dashboards/sum', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/income-dashboards/sum', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getDebtDashboard = createAsyncThunk('api/debt-dashboards', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/debt-dashboards', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getSumDebtDashboard = createAsyncThunk('api/debt-dashboards/sum', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/debt-dashboards/sum', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getOrderSale = createAsyncThunk('api/report-sale-order', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/sale-report', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getBestProductSale = createAsyncThunk('api/best-product-saler', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/best-product-sale', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getBestCustomer = createAsyncThunk('api/best-customer', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/best-customer', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});