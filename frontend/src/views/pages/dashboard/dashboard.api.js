import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getIncomeDashboard = createAsyncThunk('api/income-dashboards', async (params, thunkAPI) => {
  try {
    const result = await axios.get('api/income-dashboards', {params: params});
    return result.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
