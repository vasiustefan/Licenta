import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../main";

const initialState = {
  loading: false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: "",
};

export const signInUser = createAsyncThunk(
  "user/signIn",
  async ({ email, password }) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    localStorage.setItem("user", JSON.stringify(userCredential.user));
    return userCredential.user;
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ email, password }) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    localStorage.setItem("user", JSON.stringify(userCredential.user));
    return userCredential.user;
  }
);

export const signOutUser = createAsyncThunk("user/signOut", async () => {
  localStorage.removeItem("user");
  await signOut(auth);
});

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state) => {
      const localStorageData = localStorage.getItem("user");
      if (localStorageData) {
        const user = JSON.parse(localStorageData);

        state.user = {
          email: user.email,
        };
        state.error = "";
      } else {
        state.user = null;
        state.error = "Nu s-a gasit user";
      }
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signInUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signInUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.user = null;
    });

    builder.addCase(signOutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signOutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });
    builder.addCase(signOutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.user = null;
    });

    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.user = null;
    });
  },
});

export default userSlice.reducer;
export const { setUser } = userSlice.actions;
