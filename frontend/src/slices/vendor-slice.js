import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from "../config/axios";

export const createVendor = createAsyncThunk("vendor/createVendor", async ({formData, resetForm}, {rejectWithValue}) => {
    try{
        const response = await axios.post("/vendor", formData, { headers: { Authorization: localStorage.getItem('token') } });
        resetForm();
        return response.data;
    } catch (err) {
        return rejectWithValue(err?.response?.data?.error || err.message || 'Create vendor failed');
    }
})

const vendorSlice = createSlice({
    name: "vendor",
    initialState: {
        data: [],
        errors: null,
        loading: false,
    },
    extraReducers: (builder) => {
        builder
        .addCase(createVendor.fulfilled, (state, action) => {
            state.loading = false;
            state.data.push(action.payload);
            state.errors = null;
        })
        .addCase(createVendor.rejected, (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        })
    }
})

export default vendorSlice.reducer;