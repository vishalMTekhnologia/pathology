// src/features/admin/ReportSlice.js
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

// ── Fetch all reports ────────────────────────────────────────────────────────
export const fetchReports = createAsyncThunk(
    "reports/fetchReports",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/report/get-report`, {
                headers: authHeaders(),
            });
            // API returns data array in the response
            if (data.success && Array.isArray(data.data)) {
                return data.data;
            }
            return [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch reports");
        }
    }
);

// ── Fetch report by ID ────────────────────────────────────────────────────────
export const fetchReportById = createAsyncThunk(
    "reports/fetchReportById",
    async (reportId, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/report/get-report/${reportId}`, {
                headers: authHeaders(),
            });
            return data.data || null;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch report");
        }
    }
);

// ── Report Slice ─────────────────────────────────────────────────────────────
const reportSlice = createSlice({
    name: "reports",
    initialState: {
        reports: [],
        selectedReport: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearReportError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all reports
        builder
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReports.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.reports = payload;
            })
            .addCase(fetchReports.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // Fetch report by ID
        builder
            .addCase(fetchReportById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReportById.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.selectedReport = payload;
            })
            .addCase(fetchReportById.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    },
});

export const { clearReportError } = reportSlice.actions;
export default reportSlice.reducer;