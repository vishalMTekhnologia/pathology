// src/features/admin/CategorySlice.js
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

// ── Fetch all categories ──────────────────────────────────────────────────────
export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/category/get`, {
                headers: authHeaders(),
            });
            // Handle array or single object in 'message' or 'data'
            if (Array.isArray(data.message)) return data.message;
            if (Array.isArray(data.data)) return data.data;
            if (data.message && typeof data.message === "object") return [data.message];
            if (data.data && typeof data.data === "object") return [data.data];
            return [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
        }
    }
);

// ── Add category ──────────────────────────────────────────────────────────────
export const addCategory = createAsyncThunk(
    "categories/addCategory",
    async (categoryData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/api/v1/category/add`, categoryData, {
                headers: authHeaders(),
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to add category");
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const categorySlice = createSlice({
    name: "categories",
    initialState: {
        categories: [],
        loading: false,
        actionLoading: false,
        error: null,
        actionError: null,
        success: false,
    },
    reducers: {
        resetCategoryState(state) {
            state.error = null;
            state.actionError = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        // Fetch all
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.categories = payload;
            })
            .addCase(fetchCategories.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // Add
        builder
            .addCase(addCategory.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.success = false;
            })
            .addCase(addCategory.fulfilled, (state) => {
                state.actionLoading = false;
                state.success = true;
            })
            .addCase(addCategory.rejected, (state, { payload }) => {
                state.actionLoading = false;
                state.actionError = payload;
            });
    },
});

export const { resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
