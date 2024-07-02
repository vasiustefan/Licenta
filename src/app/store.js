import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import modalReducer from "../features/modalSlice";
import tureReducer from "../features/tureSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    ture: tureReducer,
  },
});
export default store;
