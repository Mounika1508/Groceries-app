// src/slices/cart-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

// ADD to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/cart/addItem",
        { productId, quantity: 1 },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.error || "Failed to add");
    }
  }
);

// FETCH CART
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/cart/view", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue("Cart empty");
    }
  }
);

// UPDATE quantity (+ / –)
export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/cart/updateItem/${productId}`,
        { quantity },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to update item");
    }
  }
);

// REMOVE ITEM
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/cart/removeItem/${productId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.error || "Failed to remove item");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.delete("/cart/clear", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to clear cart"
      );
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      });

  },
});

export default cartSlice.reducer;