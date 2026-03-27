import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

// CREATE DELIVERY BOY PROFILE
export const createDeliveryBoy = createAsyncThunk(
  "deliveryboy/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/deliveryboy", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return res.data;
    } catch (err) {
        console.log(err.response.data);
      return rejectWithValue(
        err.response?.data.error || { message: "Something went wrong" }
      )
    }
  }
);

// FETCH OWN PROFILE
export const fetchDeliveryBoyProfile = createAsyncThunk(
  "deliveryboy/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/deliveryboy/account", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return res.data;
    } catch (err) {
        console.log(err.response.data);
      return rejectWithValue(err.response?.data.error || { message: "Something went wrong" });
    }
  }
);

export const getDeliveryBoys = createAsyncThunk(
  "order/getDeliveryBoys",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/deliveryboys/availableList", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error);
    }
  }
);

export const getMyDeliveryOrders = createAsyncThunk(
  "deliveryboy/myOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/deliveryboy/myOrders", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error);
    }
  }
);

export const updateDeliveryBoy = createAsyncThunk(
  "deliveryboy/update",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.put("/deliveryboy/update", formData, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteDeliveryBoy = createAsyncThunk(
  "deliveryboy/delete",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.delete("/deliveryboy/remove", {
        headers: { Authorization: localStorage.getItem("token") }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const deliveryBoySlice = createSlice({
  name: "deliveryboy",
  initialState: {
    dboyProfile: null,
    deliveryBoys : [],
    myOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // CREATE
    builder.addCase(createDeliveryBoy.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createDeliveryBoy.fulfilled, (state, action) => {
      state.loading = false;
      state.dboyProfile = action.payload;
      state.error = null;
    });

    builder.addCase(createDeliveryBoy.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // FETCH
    builder.addCase(fetchDeliveryBoyProfile.fulfilled, (state, action) => {
      state.dboyProfile = action.payload;
    })

    .addCase(getDeliveryBoys.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDeliveryBoys.fulfilled, (state, action) => {
        state.loading = false;  
        state.deliveryBoys = action.payload;
      })

      .addCase(getDeliveryBoys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMyDeliveryOrders.fulfilled, (state, action) => {
         state.myOrders = action.payload;
      })
 
      .addCase(updateDeliveryBoy.fulfilled, (state, action) => {
        state.dboyProfile = action.payload;
      })

      .addCase(deleteDeliveryBoy.fulfilled, (state) => {
        state.dboyProfile = null;
      })
   },
});

export default deliveryBoySlice.reducer;
