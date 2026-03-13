import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { fetchUserProfile } from './authSlice';

// 1. Make a class reservation -> /bookings/book/
export const bookSession = createAsyncThunk(
  'bookings/book',
  async (sessionId, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/bookings/book/', { session_id: sessionId });
      // On success, refresh user credits and schedule automatically
      dispatch(fetchUserProfile()); 
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Booking failed");
    }
  }
);

// 2. Cancel a booking -> /bookings/cancel/<int:booking_id>/
export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (bookingId, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post(`/bookings/cancel/${bookingId}/`);
      // Refresh user profile to restore the credit
      dispatch(fetchUserProfile());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Cancellation failed");
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: { 
    loading: false, 
    success: false, 
    error: null 
  },
  reducers: {
    resetBookingState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookSession.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(bookSession.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(bookSession.rejected, (state, action) => {
        state.loading = false;
        // Backend returns {"error": "..."} or similar
        state.error = action.payload?.error || "Booking failed. Check your credits.";
      })
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Could not cancel booking.";
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
