import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

/* PLACE ORDER */
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/orders/placeOrder",
        orderData,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order failed");
    }
  }
);

export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/orders/myOrders", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error);
    }
  }
);

export const getVendorOrders = createAsyncThunk(
  "order/getVendorOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/orders/vendorOrders", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error);
    }
  }
);

export const startPacking = createAsyncThunk(
  "order/startPacking",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/orders/startPacking/${orderId}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error);
    }
  }
);



export const assignDeliveryBoy = createAsyncThunk(
  "order/assignDeliveryBoy",
  async ({ orderId, deliveryBoyId }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/orders/assignDeliveryBoy/${orderId}`,
        { deliveryBoyId },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error);
    }
  }
);

export const markAsDelivered = createAsyncThunk(
  "deliveryboy/markAsDelivered",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/orders/markAsDelivered/${orderId}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error);
    }
  }
);



const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;  // 👈 store orders
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getVendorOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVendorOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getVendorOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(startPacking.pending, (state) => {
        state.loading = true;
      })
      .addCase(startPacking.fulfilled, (state, action) => {
        state.loading = false;
        const updatedId = action.meta.arg;
        const order = state.orders.find(o => o._id === updatedId);
        if (order) {
          order.status = "packing";
        }
      })

      .addCase(startPacking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(assignDeliveryBoy.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignDeliveryBoy.fulfilled, (state, action) => {
       state.loading = false;
        const updatedId = action.meta.arg.orderId;
        const order = state.orders.find(o => o._id === updatedId);
        if (order) {
          order.status = "on-the-way";
        }
      })

      .addCase(assignDeliveryBoy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markAsDelivered.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAsDelivered.fulfilled, (state, action) => {
        state.loading = false;

        const updatedId = action.meta.arg;
        const order = state.orders.find(o => o._id === updatedId);

        if (order) {
          order.status = "delivered";
          order.deliveredAt = new Date();   // 👈 update locally
        }
      })
      .addCase(markAsDelivered.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
