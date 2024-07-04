import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../main";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const createNewTura = createAsyncThunk(
  "ture/createNewTura",
  async (dataRoute, { getState }) => {
    const { user } = getState().user;
    const dataWithUser = {
      ...dataRoute,
      createdBy: user ? user.uid : null,
    };

    const docRef = await addDoc(collection(db, "ture"), dataWithUser);
    return { id: docRef.id, ...dataWithUser };
  }
);

export const fetchAllTure = createAsyncThunk("ture/fetchAllTure", async () => {
  const querySnapshot = await getDocs(collection(db, "ture"));
  const ture = [];
  querySnapshot.forEach((doc) => {
    ture.push({ id: doc.id, ...doc.data() });
  });
  return ture;
});

const tureSlice = createSlice({
  name: "ture",
  initialState: {
    ture: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTure.fulfilled, (state, action) => {
        state.loading = false;
        state.ture = action.payload;
      })
      .addCase(fetchAllTure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createNewTura.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewTura.fulfilled, (state, action) => {
        state.loading = false;
        state.ture.push(action.payload);
      })
      .addCase(createNewTura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default tureSlice.reducer;
