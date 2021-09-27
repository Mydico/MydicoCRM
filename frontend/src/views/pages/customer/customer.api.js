import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getCustomer = createAsyncThunk('api/customers', async (params = {page: 0, size: 50, sort: 'createdDate,DESC'}, thunkAPI) => {
  try {
    const result = await axios.get('api/customers', {params: params});
    return {data: result.data, total: result.headers['x-total-count']};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// export const getCustomer = createAsyncThunk('api/customers', async (params = {page: 0, size: 50, sort: 'createdDate,DESC'}, thunkAPI) => {
//   try {
//     const result = await axios.get('api/customers', {params: params});
//     return {data: result.data, total: result.headers['x-total-count']};
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response.data);
//   }
// });


export const filterCustomer = createAsyncThunk('api/customers/find', async (params = {page: 0, size: 50, sort: 'createdDate,DESC'}, thunkAPI) => {
  try {
    const result = await axios.get('api/customers/find', {params: params});
    return {data: result.data, total: result.headers['x-total-count']};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const filterCustomerNotToStore = createAsyncThunk('api/customers/filterCustomerNotToStore', async (params = {page: 0, size: 50, sort: 'createdDate,DESC'}, thunkAPI) => {
  try {
    const result = await axios.get('api/customers/find/exact', {params: params});
    return {data: result.data, total: result.headers['x-total-count']};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCustomerBirthday = createAsyncThunk(
    'api/customers/birthday',
    async (params = {page: 0, size: 20, sort: 'createdDate,DESC'}, thunkAPI) => {
      try {
        const result = await axios.get('api/customers/birthday', {params: params});
        return {data: result.data, total: result.headers['x-total-count']};
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    },
);

export const getDetailCustomer = createAsyncThunk('api/detail/customers', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/customers/' + params.id, { params: params });
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingCustomer = createAsyncThunk('api/create/customers', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/customers', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateCustomer = createAsyncThunk('api/update/customers', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/customers', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateManyCustomer = createAsyncThunk('api/update/customers/many', async (body, thunkAPI) => {
  try {
    const result = await axios.put('api/customers/many', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingCustomerType = createAsyncThunk('api/create/customers-type', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/customer-types', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const creatingCustomerStatus = createAsyncThunk('api/create/customers-status', async (body, thunkAPI) => {
  try {
    const result = await axios.post('api/customer-statuses', body);
    return {data: result.data, headers: result.headers, statusCode: result.status};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCity = createAsyncThunk('api/cities', async (params = {page: 0, size: 100, sort: 'code,asc'}, thunkAPI) => {
  try {
    const result = await axios.get('api/cities', {params: params});
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getDistrict = createAsyncThunk('api/districts', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/districts', {params});
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getWard = createAsyncThunk('api/wards', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/wards', {params: params});
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCustomerType = createAsyncThunk(
    'api/customer/customer-types',
    async (params = {page: 0, size: 20, sort: 'name,asc'}, thunkAPI) => {
      try {
        const result = await axios.get('api/customer-types', {params: params});
        return result.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    },
);

export const getCustomerStatus = createAsyncThunk(
    'api/customer/customer-statuses',
    async (params = {page: 0, size: 20, sort: 'name,asc'}, thunkAPI) => {
      try {
        const result = await axios.get('api/customer-statuses', {params: params});
        return result.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    },
);

export const getBranches = createAsyncThunk('api/customer/branches', async (params = {page: 0, size: 20, sort: 'name,asc'}, thunkAPI) => {
  try {
    const result = await axios.get('api/branches', {params: params});
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const syncCustomer = createAsyncThunk('api/customer/sync', async (params = {page: 0, size: 20, sort: 'name,asc'}, thunkAPI) => {
  try {
    const result = await axios.get('api/customers/sync');
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});