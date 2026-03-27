// src/slices/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async ({ formData, resetForm }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/categories", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      if (resetForm) resetForm();
      return response.data;

    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to add category"
      );
    }
  }
);

export const fetchPublicCategories = createAsyncThunk(
  "publicCategory/fetchPublicCategories",
  async (vendorId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/categories/publicList/${vendorId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to load categories");
    }
  }
);



export const listCategories = createAsyncThunk(
  "category/listCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/categories/list", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      return response.data;

    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to load categories"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/categories/update/${id}`,
        formData,
        {
          headers: { Authorization: localStorage.getItem("token") }
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Update failed");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/categories/remove/${id}`, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Delete failed");
    }
  }
);


const categorySlice = createSlice({
  name: "category",

  initialState: {
    categories: [],
    publicCategories: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.categories.push(action.payload); // add new one
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(listCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(listCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPublicCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.publicCategories = action.payload;
      })
      .addCase(fetchPublicCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.categories[index] = action.payload;
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
