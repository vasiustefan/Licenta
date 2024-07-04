import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import modalReducer from "../features/modalSlice";
import tureReducer from "../features/tureSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    ture: tureReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
