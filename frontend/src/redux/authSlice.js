import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";
import { getLocalToken, setLocalToken, clearAuthData } from "../utils/local-storage";

// Login Thunk - returns tokens only
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post("/accounts/login/", credentials);
      // localstorage
      setLocalToken("access", data.access);
      setLocalToken("refresh", data.refresh);
      
      // Fetch user data
      dispatch(fetchUserProfile());
      
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// Get User Data
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUser",
  async(_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/accounts/user/");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch user");
    }
  }
);

// Register Thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/accounts/register/", userData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Registration failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: getLocalToken("access"),
    refreshToken: getLocalToken("refresh"),
    isLoggedIn: !!getLocalToken("access"),
    registrationSuccess: false,
    userLoading: false,
    loading: false,
    error: null,
  },
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      clearAuthData();
    },
    resetRegisterSuccess: (state) => {
      state.registrationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
    // Login 
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.detail || action.payload?.error || "Login failed";
    })
    // User data
    .addCase(fetchUserProfile.pending, (state) => {
        state.userLoading = true;
      })
    .addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.userLoading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    })
    .addCase(fetchUserProfile.rejected, (state) => {
      state.userLoading = false;
      state.user = null;
      state.isLoggedIn = false;
      clearAuthData();
    })
    // Register
    .addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
      state.registrationSuccess = true;
      state.error = null;
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setTokens, logout, resetRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;
