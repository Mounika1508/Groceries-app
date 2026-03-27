import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async ({ formData, resetForm }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/products", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data"
        }
      });

      resetForm && resetForm();
      return response.data;

    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to add product"
      );
    }
  }
);

export const fetchPublicProducts = createAsyncThunk(
  "product/fetchPublicProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/products/publicList");
      return response.data;

    } catch (err) {
      return rejectWithValue("Failed to load public products");
    }
  }
);


export const listProducts = createAsyncThunk(
  "product/listProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/products/vendorList", {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      return response.data;

    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to load products"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/products/update/${id}`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Update failed");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/products/remove/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue("Delete failed");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    publicProducts: [],
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // ADD PRODUCT
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LIST PRODUCTS
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPublicProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.publicProducts = action.payload;
      })
      .addCase(fetchPublicProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        state.products[index] = action.payload;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  }
});

export default productSlice.reducer;
