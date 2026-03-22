import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const addDoctor = createAsyncThunk(
    "doctor/addDoctor",
    async (doctorData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${BASE_URL}/api/v1/doctore/add`,
                doctorData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add doctor"
            );
        }
    }
);

const addDoctorSlice = createSlice({
    name: "doctor",
    initialState: {
        loading: false,
        success: false,
        error: null,
        message: null,
    },
    reducers: {
        resetDoctorState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addDoctor.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = null;
            })
            .addCase(addDoctor.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.data || "Doctor added successfully";
            })
            .addCase(addDoctor.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export const { resetDoctorState } = addDoctorSlice.actions;
export default addDoctorSlice.reducer;