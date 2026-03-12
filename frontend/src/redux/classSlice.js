import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import siteData from '../components/data.json';

export const fetchClassTypes = createAsyncThunk(
  'classTypes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/bookings/class-types/');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch class types");
    }
  }
);

const classTypesSlice = createSlice({
  name: 'classTypes',
  initialState: { 
    items: siteData.classes,
    loading: false, 
    error: null 
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClassTypes.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchClassTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default classTypesSlice.reducer;
