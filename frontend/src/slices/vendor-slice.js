import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from "../config/axios";

export const createVendor = createAsyncThunk("vendor/createVendor", async ({formData, resetForm}, {rejectWithValue}) => {
    try{
        const response = await axios.post("/vendor", formData, { headers: { Authorization: localStorage.getItem('token') } });
        resetForm();
        return response.data;
    } catch (err) {
        console.log(err.response.data);
        return rejectWithValue(err?.response?.data?.errors || err.message || 'Create vendor failed');
    }
})

export const listVendors = createAsyncThunk(
  "vendor/listVendors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/vendors/list", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data; 
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to load vendors"
      );
    }
  }
);

export const updateVendor = createAsyncThunk(
  "vendor/updateVendor",
  async ({ vendorId, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/vendors/update/${vendorId}`, formData, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      alert("Profile updated successfully");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchMyVendorProfile = createAsyncThunk(
  "vendor/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/vendors/myProfile", {
        headers: { Authorization: localStorage.getItem("token") }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error);
    }
  }
);

export const getVendorById = createAsyncThunk(
  "vendor/getVendorById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/vendors/profile/${id}`);  
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to load vendor details"
      );
    } 
  }
);
 
const vendorSlice = createSlice({
    name: "vendor",
    initialState: {
        data: [],
        vendors: [],
        vendor: null,
        selectedVendor: null, 
        errors: null,
        loading: false,
    },
    extraReducers: (builder) => {
        builder
        .addCase(createVendor.pending, (state) => {
            state.loading = true;
            state.errors = null;
        })
        .addCase(createVendor.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })  
        .addCase(createVendor.rejected, (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        })

        .addCase(fetchMyVendorProfile.fulfilled, (state, action) => {
            state.vendor = action.payload;
          })
                  // List all vendors
        .addCase(listVendors.pending, (state) => {
          state.loading = true;
          state.errors = null;
        })
        .addCase(listVendors.fulfilled, (state, action) => {
          state.loading = false;
          state.vendors = action.payload;
        })
        .addCase(listVendors.rejected, (state, action) => {
          state.loading = false;
          state.errors = action.payload;
        })

        .addCase(getVendorById.pending, (state) => {
          state.loading = true;
          state.errors = null;
        })
        .addCase(getVendorById.fulfilled, (state, action) => {
          state.loading = false;
          state.selectedVendor = action.payload;
        })
        .addCase(getVendorById.rejected, (state, action) => {
          state.loading = false;
          state.errors = action.payload;
        })

        .addCase(updateVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload; // updated data
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    }
})

export default vendorSlice.reducer;