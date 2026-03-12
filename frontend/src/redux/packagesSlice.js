import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import siteData from '../components/data.json';

export const fetchPackages = createAsyncThunk(
  'packages/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/memberships/templates/');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch packages");
    }
  }
);

const packagesSlice = createSlice({
  name: 'packages',
  initialState: { 
    items: siteData.pricing, // Local mock data for instant render
    loading: false, 
    error: null 
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default packagesSlice.reducer;
