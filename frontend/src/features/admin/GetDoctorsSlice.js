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
            return response.data.data;
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