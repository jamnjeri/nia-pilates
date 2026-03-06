import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
// import classReducer from "./classSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add others here as you build them:
    // classes: classReducer,
  },
});
