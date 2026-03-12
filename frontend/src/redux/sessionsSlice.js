import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchScheduledSessions = createAsyncThunk(
  'sessions/fetchLive',
  async (_, { rejectWithValue }) => {
    try {
      // Endpoint for the actual calendar entries
      const { data } = await api.get('/bookings/sessions');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load schedule");
    }
  }
);

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState: { 
    items: [], 
    loading: false, 
    error: null 
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduledSessions.pending, (state) => { state.loading = true; })
      .addCase(fetchScheduledSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchScheduledSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sessionsSlice.reducer;
