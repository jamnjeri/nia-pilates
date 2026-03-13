import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import classTypesReducer from "./classSlice";
import packagesReducer from "./packagesSlice";
import sessionsReducer from "./sessionsSlice";
import paymentsReducer from "./paymentSlice";
import bookingsReducer from "./bookingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classTypes: classTypesReducer,
    packages: packagesReducer,
    sessions: sessionsReducer,
    payments: paymentsReducer,
    bookings: bookingsReducer
  },
});
