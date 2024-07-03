import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../main";

const initialState = {
  ture: [],
  loadingAll: false,
  loadingCreate: false,
  errors: "",
};

export const fetchAllTure = createAsyncThunk("ture/fetchAll", async () => {
  const querySnapshot = await getDocs(collection(db, "listaTure"));

  console.log(querySnapshot);

  const itemsArray = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log(itemsArray);

  return itemsArray;
});

export const createNewTura = createAsyncThunk(
  "ture/create",
  async (dataRoute) => {
    try {
      await addDoc(collection(db, "listaTure"), dataRoute);

      alert("success");
    } catch (err) {
      console.error(err);
    }
  }
);

const tureSlice = createSlice({
  name: "ture",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllTure.pending, (state) => {
      state.loadingAll = true;
    });
    builder.addCase(fetchAllTure.fulfilled, (state, action) => {
      state.loadingAll = true;
      state.ture = action.payload;
    });
    builder.addCase(fetchAllTure.rejected, (state, action) => {
      state.loadingAll = true;
      state.ture = [];
      state.errors = action.error.message;
    });

    builder.addCase(createNewTura.pending, (state) => {
      state.loadingCreate = true;
    });
    builder.addCase(createNewTura.fulfilled, (state, action) => {
      state.loadingCreate = true;
      state.ture = action.payload;
    });
    builder.addCase(createNewTura.rejected, (state, action) => {
      state.loadingCreate = true;
      state.errors = action.error.message;
    });
  },
});

export default tureSlice.reducer;
