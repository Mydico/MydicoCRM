import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getOrder = createAsyncThunk('api/reports/order', async (params = {}, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/order', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getNewCustomer = createAsyncThunk('api/reports/new-customer', async (params = {}, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/new-customer', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getIncome = createAsyncThunk('api/reports/income', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/income', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getDebt = createAsyncThunk('api/reports/debt', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/debt', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getTop10sale = createAsyncThunk('api/reports/top10sale', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/top10sale', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getTop10Product = createAsyncThunk('api/reports/top10product', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/top10product', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getTop10Customer = createAsyncThunk('api/reports/top10customer', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/top10customer', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getDepartmentReport = createAsyncThunk('api/reports/department', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/department', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getDepartmentReportExternal = createAsyncThunk('api/reports/department-for-external-child', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/department-for-external-child', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCustomerCountReport = createAsyncThunk('api/reports/count-customer', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/count-customer', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCountTotalProduct = createAsyncThunk('api/reports/count-total-product', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/count-total-product', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getCountTotalPriceProduct = createAsyncThunk('api/reports/count-total-price-product', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/count-total-price-product', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getProductReport = createAsyncThunk('api/reports/product-report', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/product-report', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getProductDetailReport = createAsyncThunk('api/reports/product-report', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/product-detail-report', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getSaleReport = createAsyncThunk('api/reports/user-report', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/user-report', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getSaleSummaryReport = createAsyncThunk('api/reports/sale-summary-report', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/sale-summary-report', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCustomerReport = createAsyncThunk('api/reports/customer-report', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/customer-report', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCustomerPriceReport = createAsyncThunk('api/reports/customer-price-report', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/customer-price-report', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getCustomerSummaryReport = createAsyncThunk('api/reports/customer-summary-report', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/customer-summary-report', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getPromotionReport = createAsyncThunk('api/reports/promotion-report', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/promotion-report', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getPromotionCustomer = createAsyncThunk('api/reports/customer-promotion', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/promotion-customer-report', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const getPromotionIncome = createAsyncThunk('api/reports/promotion-income-report', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/reports/promotion-imcome-report', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getWarehouseReport = createAsyncThunk('api/reports/warehouse-report', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/privates/warehouse-private', { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});