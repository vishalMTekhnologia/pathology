// src/features/admin/SubCategorySlice.js
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

// ── Fetch all sub-categories ──────────────────────────────────────────────────
export const fetchSubCategories = createAsyncThunk(
    "subCategories/fetchSubCategories",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/sub-category/get`, {
                headers: authHeaders(),
            });
            if (Array.isArray(data.message)) return data.message;
            if (Array.isArray(data.data)) return data.data;
            if (data.message && typeof data.message === "object") return [data.message];
            if (data.data && typeof data.data === "object") return [data.data];
            return [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch sub-categories");
        }
    }
);

// ── Add sub-category ──────────────────────────────────────────────────────────
export const addSubCategory = createAsyncThunk(
    "subCategories/addSubCategory",
    async (subCategoryData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/api/v1/sub-category/add`, subCategoryData, {
                headers: authHeaders(),
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to add sub-category");
        }
    }
);

// ── Update sub-category ───────────────────────────────────────────────────────
export const updateSubCategory = createAsyncThunk(
    "subCategories/updateSubCategory",
    async ({ id, ...subCategoryData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.patch(
                `${BASE_URL}/api/v1/sub-category/update/${id}`,
                subCategoryData,
                { headers: authHeaders() }
            );
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update sub-category");
        }
    }
);

// ── Delete sub-category ───────────────────────────────────────────────────────
export const deleteSubCategory = createAsyncThunk(
    "subCategories/deleteSubCategory",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(
                `${BASE_URL}/api/v1/sub-category/delete/${id}`,
                { headers: authHeaders() }
            );
            return { id, ...data };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete sub-category");
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const subCategorySlice = createSlice({
    name: "subCategories",
    initialState: {
        subCategories: [],
        loading: false,
        actionLoading: false,
        error: null,
        actionError: null,
        success: false,
    },
    reducers: {
        resetSubCategoryState(state) {
            state.error = null;
            state.actionError = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        // Fetch all
        builder
            .addCase(fetchSubCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubCategories.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.subCategories = payload;
            })
            .addCase(fetchSubCategories.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // Add
        builder
            .addCase(addSubCategory.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.success = false;
            })
            .addCase(addSubCategory.fulfilled, (state) => {
                state.actionLoading = false;
                state.success = true;
            })
            .addCase(addSubCategory.rejected, (state, { payload }) => {
                state.actionLoading = false;
                state.actionError = payload;
            });

        // Update
        builder
            .addCase(updateSubCategory.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.success = false;
            })
            .addCase(updateSubCategory.fulfilled, (state) => {
                state.actionLoading = false;
                state.success = true;
            })
            .addCase(updateSubCategory.rejected, (state, { payload }) => {
                state.actionLoading = false;
                state.actionError = payload;
            });

        // Delete
        builder
            .addCase(deleteSubCategory.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(deleteSubCategory.fulfilled, (state) => {
                state.actionLoading = false;
                state.success = true;
            })
            .addCase(deleteSubCategory.rejected, (state, { payload }) => {
                state.actionLoading = false;
                state.actionError = payload;
            });
    },
});

export const { resetSubCategoryState } = subCategorySlice.actions;
export default subCategorySlice.reducer;