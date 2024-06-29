import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../main";
import axios from "axios";

const initialState = {
  loading: false,
  user: null,
  error: "",
};

export const fetchUser = createAsyncThunk("user/fetchUser", () => {
  return axios
    .get("https://jsonplaceholder.typicode.com/users")
    .then((res) => {
      console.log(res);
      // const data = res.data.map((user: any) => user);
      // console.log(data);
      return {
        name: "Stefan",
        age: "24",
      };
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
});

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
    console.log(email, password);
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
    // login: (state, action) => {
    //   const { email, password } = action.payload;
    //   state.loading = true;
    //   signInWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //       state.user = userCredential.user;
    //       console.success("logged in");
    //     })
    //     .catch((error) => {
    //       state.user = null;
    //       state.error = {
    //         errorCode: error.code,
    //         errorMessage: error.message,
    //       };
    //     })
    //     .finally(() => {
    //       state.loading = false;
    //     });
    // },
    // logout: (state) => {
    //   state.user = null;
    //   signOut(auth)
    //     .then(() => {
    //       console.success("logged out");
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // },
    // register: (state, action) => {
    //   const { email, password } = action.payload;
    //   state.loading = true;
    //   createUserWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //       state.user = userCredential.user;
    //       console.success("signed up");
    //     })
    //     .catch((error) => {
    //       state.user = null;
    //       state.error = {
    //         errorCode: error.code,
    //         errorMessage: error.message,
    //       };
    //     })
    //     .finally(() => {
    //       state.loading = false;
    //     });
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = "";
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.user = [];
      state.error =
        action.error.message || "There was an error on your request.";
    });

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
export const { setUser, login, logout, register } = userSlice.actions;
