// src/features/admin/GetDoctorsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchDoctors = createAsyncThunk(
    "doctorList/fetchDoctors",
    async (lab_id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${BASE_URL}/api/v1/doctore/get-doctore-by-lab-wise`,
                {
                    params: { lab_id },
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                }
            );
            const data = response.data;
            // API returns array in 'data' field — check that first
            if (Array.isArray(data.data)) return data.data;
            if (Array.isArray(data.message)) return data.message;
            if (data.data && typeof data.data === "object") return [data.data];
            if (data.message && typeof data.message === "object") return [data.message];
            return [];
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch doctors"
            );
        }
    }
);

const getDoctorsSlice = createSlice({
    name: "doctorList",
    initialState: {
        loading: false,
        doctors: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload;
            })
            .addCase(fetchDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getDoctorsSlice.reducer;