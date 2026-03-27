import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

// Get pending vendors
export const fetchPendingVendors = createAsyncThunk(
  "admin/fetchPendingVendors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/admin/pendingVendors", {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Get all orders (Admin)
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/orders/adminOrders", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Approve vendor
export const approveVendor = createAsyncThunk(
  "admin/approveVendor",
  async (vendorId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/admin/approveVendor/${vendorId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
      return vendorId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Reject vendor
export const rejectVendor = createAsyncThunk(
  "admin/rejectVendor",
  async (vendorId, { rejectWithValue }) => {
    try {
      await axios.delete(`/admin/rejectVendor/${vendorId}/`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      return vendorId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAllVendors = createAsyncThunk(
  "admin/fetchAllVendors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/vendors/list", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchVendorDetails = createAsyncThunk(
  "admin/fetchVendorDetails",
  async (vendorId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/vendors/profile/${vendorId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/users/list", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



const adminSlice = createSlice({
  name: "admin",
  initialState: {
    pendingVendors: [],
    allVendors: [],
    allUsers: [],
    allOrders: [],
    vendorDetails: {},
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchPendingVendors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingVendors = action.payload;
      })
      .addCase(fetchPendingVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // approve
      .addCase(approveVendor.fulfilled, (state, action) => {
        state.pendingVendors = state.pendingVendors.filter(
          (v) => v._id !== action.payload
        );
      })

      // reject
      .addCase(rejectVendor.fulfilled, (state, action) => {
        state.pendingVendors = state.pendingVendors.filter(
          (v) => v._id !== action.payload
        );
      })

      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchVendorDetails.fulfilled, (state, action) => {
        state.vendorDetails[action.payload._id] = action.payload;
      })

      .addCase(fetchAllVendors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.allVendors = action.payload;
      })
      .addCase(fetchAllVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }
});

export default adminSlice.reducer;
