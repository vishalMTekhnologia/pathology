// src/features/admin/BloodCollectionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// ── Fetch blood collection boys ───────────────────────────────────────────────
export const fetchBloodBoys = createAsyncThunk(
    "bloodCollection/fetchBloodBoys",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                `${BASE_URL}/api/v1/users/get-blood-boys`,
                { headers: authHeaders() }
            );
            // API returns data array in the response
            if (data.success && Array.isArray(data.data)) {
                return data.data;
            }
            return [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch blood collection boys");
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const bloodCollectionSlice = createSlice({
    name: "bloodCollection",
    initialState: {
        bloodBoys: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetBloodBoysState(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBloodBoys.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBloodBoys.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.bloodBoys = payload;
            })
            .addCase(fetchBloodBoys.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    },
});

export const { resetBloodBoysState } = bloodCollectionSlice.actions;
export default bloodCollectionSlice.reducer;