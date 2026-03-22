import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const updateDoctor = createAsyncThunk(
    "doctorUpdate/updateDoctor",
    async (doctorData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `${BASE_URL}/api/v1/doctore/update`,
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
                error.response?.data?.message || "Failed to update doctor"
            );
        }
    }
);

const updateDoctorSlice = createSlice({
    name: "doctorUpdate",
    initialState: {
        loading: false,
        success: false,
        error: null,
        message: null,
    },
    reducers: {
        resetUpdateDoctorState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateDoctor.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
                state.message = null;
            })
            .addCase(updateDoctor.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.data || "Doctor updated successfully";
            })
            .addCase(updateDoctor.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export const { resetUpdateDoctorState } = updateDoctorSlice.actions;
export default updateDoctorSlice.reducer;