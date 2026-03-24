// src/features/admin/TestSlice.js
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

// ── Fetch all tests ───────────────────────────────────────────────────────────
export const fetchTests = createAsyncThunk(
    "tests/fetchTests",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/test/get`, {
                headers: authHeaders(),
            });
            // Handle array or single object in 'message' or 'data'
            if (Array.isArray(data.message)) return data.message;
            if (Array.isArray(data.data)) return data.data;
            if (data.message && typeof data.message === "object") return [data.message];
            if (data.data && typeof data.data === "object") return [data.data];
            return [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch tests");
        }
    }
);

// ── Add test ──────────────────────────────────────────────────────────────────
export const addTest = createAsyncThunk(
    "tests/addTest",
    async (testData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/api/v1/test/add`, testData, {
                headers: authHeaders(),
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to add test");
        }
    }
);

// ── Update test ───────────────────────────────────────────────────────────────
export const updateTest = createAsyncThunk(
    "tests/updateTest",
    async ({ id, ...testData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.patch(`${BASE_URL}/api/v1/test/update/${id}`, testData, {
                headers: authHeaders(),
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update test");
        }
    }
);

// ── Delete test ───────────────────────────────────────────────────────────────
export const deleteTest = createAsyncThunk(
    "tests/deleteTest",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${BASE_URL}/api/v1/test/delete/${id}`, {
                headers: authHeaders(),
            });
            return { id, ...data };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete test");
        }
    }
);

// ── Fetch test by ID ──────────────────────────────────────────────────────────
export const fetchTestById = createAsyncThunk(
    "tests/fetchTestById",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/test/get-by-id/${id}`, {
                headers: authHeaders(),
            });
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch test");
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const testSlice = createSlice({
    name: "tests",
    initialState: {
        tests: [],
        selectedTest: null,
        loading: false,
        actionLoading: false,
        error: null,
        actionError: null,
        success: false,
    },
    reducers: {
        resetTestState(state) {
            state.error = null;
            state.actionError = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        // Fetch all
        builder
            .addCase(fetchTests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTests.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.tests = payload;
            })
            .addCase(fetchTests.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // Add
        builder
            .addCase(addTest.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.success = false;
            })
            .addCase(addTest.fulfilled, (state) => {
                state.actionLoading = false;
                state.success = true;
            })
            .addCase(addTest.rejected, (state, { payload }) => {
                state.actionLoading = false;
                state.actionError = payload;
            });

        // Update
        builder
            .addCase(updateTest.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.success = false;
            })
            .addCase(updateTest.fulfilled, (state) => {
                state.actionLoading = false;
                state.success = true;
            })
            .addCase(updateTest.rejected, (state, { payload }) => {
                state.actionLoading = false;
                state.actionError = payload;
            });

        // Delete
        builder
            .addCase(deleteTest.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(deleteTest.fulfilled, (state) => {
                state.actionLoading = false;
                state.success = true;
            })
            .addCase(deleteTest.rejected, (state, { payload }) => {
                state.actionLoading = false;
                state.actionError = payload;
            });

        // Fetch by ID
        builder
            .addCase(fetchTestById.fulfilled, (state, { payload }) => {
                state.selectedTest = payload;
            });
    },
});

export const { resetTestState } = testSlice.actions;
export default testSlice.reducer;
