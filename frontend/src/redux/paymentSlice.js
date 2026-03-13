import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Step 1: Trigger the STK Push
export const initiatePayment = createAsyncThunk(
  'payment/initiate',
  async ({ packageId, phoneNumber }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/memberships/pay/', {
        package_id: packageId,
        phone_number: phoneNumber
      });
      return data; // Expected: { checkout_request_id: "...", message: "..." }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to start payment");
    }
  }
);

// Step 2: Poll for status
export const checkPaymentStatus = createAsyncThunk(
  'payment/checkStatus',
  async (checkoutId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/memberships/status/${checkoutId}/`);
      return data; // Expected: { status: "COMPLETED" | "PENDING" | "FAILED" }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Status check failed");
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    loading: false,
    checkoutId: null,
    paymentStatus: 'idle', // 'idle' | 'awaiting_pin' | 'processing' | 'success' | 'failed'
    receipt: null,
    packageName: null,
    error: null,
  },
  reducers: {
    resetPayment: (state) => {
      state.checkoutId = null;
      state.paymentStatus = 'idle';
      state.receipt = null;
      state.packageName = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => { 
        state.loading = true; state.error = null; 
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutId = action.payload.checkout_request_id;
        state.paymentStatus = 'awaiting_pin';
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        // Map backend "COMPLETED" to our frontend "success"
        if (action.payload.status === 'COMPLETED') {
          state.paymentStatus = 'success';
          state.receipt = action.payload.receipt;
          state.packageName = action.payload.package_name;
        } else if (action.payload.status === 'FAILED') {
          state.paymentStatus = 'failed';
        }
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
