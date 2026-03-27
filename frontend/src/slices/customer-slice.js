import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async ({ formData, navigate }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/customer", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      navigate("/"); 

      return res.data;
    } catch (err) {
      return rejectWithValue(
        console.log(err?.response?.data) ||
        err?.response?.data?.message || "Failed to create profile"
      );
    } 
  }
);

export const fetchCustomerProfile = createAsyncThunk(
  "customer/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/customer/profile", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null;
      }
      return rejectWithValue(
        err?.response?.data?.error || "Failed to fetch profile"
      );
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/customer/update/${id}`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to update profile"
      );
    } 
  }
);

export const deleteCustomer = createAsyncThunk(
  "customer/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `/customer/remove/${id}`,
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



const customerSlice = createSlice({
  name: "customer",

  initialState: {
    profile: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // CREATE PROFILE
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload; // save profile in redux
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PROFILE
      .addCase(fetchCustomerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.profile = null;
        state.error = action.payload;
      })

      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      .addCase(deleteCustomer.fulfilled, (state) => {
        state.profile = null;
      });
    },
});

export default customerSlice.reducer;
