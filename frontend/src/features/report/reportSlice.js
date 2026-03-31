// src/features/report/reportSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authHeader = () => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

// ── Fetch Patients ──
export const fetchPatients = createAsyncThunk("report/fetchPatients",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/petient/get`, authHeader());
            return res.data.message; // array of patients
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to fetch patients.");
        }
    }
);

// ── Fetch Tests ──
export const fetchTests = createAsyncThunk("report/fetchTests",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/test/get`, authHeader());
            return res.data.message; // array of tests
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to fetch tests.");
        }
    }
);

// ── Fetch Blood Boys ──
export const fetchBloodBoys = createAsyncThunk("report/fetchBloodBoys",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/users/get-blood-boys`, authHeader());
            return res.data.data; // array of collectors
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to fetch collectors.");
        }
    }
);

// ── Fetch Sub-Categories by test_id ──
export const fetchSubCategories = createAsyncThunk("report/fetchSubCategories",
    async (test_id, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/v1/test/sub-category/get?test_id=${test_id}`,
                authHeader()
            );
            return res.data.data || res.data.message; // array of sub-categories
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to fetch sub-categories.");
        }
    }
);

// ── Submit Report ──
export const submitReport = createAsyncThunk("report/submitReport",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/report/add`, payload, authHeader());
            return res.data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to submit report.");
        }
    }
);

const reportSlice = createSlice({
    name: "report",
    initialState: {
        patients: [],
        tests: [],
        bloodBoys: [],
        subCategories: [],
        loading: false,
        subCatLoading: false,
        submitLoading: false,
        error: null,
        submitSuccess: false,
        reportId: null,
    },
    reducers: {
        clearReportState(state) {
            state.error = null;
            state.submitSuccess = false;
            state.reportId = null;
            state.subCategories = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // patients
            .addCase(fetchPatients.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPatients.fulfilled, (state, action) => { state.loading = false; state.patients = action.payload; })
            .addCase(fetchPatients.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // tests
            .addCase(fetchTests.pending, (state) => { state.loading = true; })
            .addCase(fetchTests.fulfilled, (state, action) => { state.loading = false; state.tests = action.payload; })
            .addCase(fetchTests.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // blood boys
            .addCase(fetchBloodBoys.pending, (state) => { state.loading = true; })
            .addCase(fetchBloodBoys.fulfilled, (state, action) => { state.loading = false; state.bloodBoys = action.payload; })
            .addCase(fetchBloodBoys.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // sub-categories
            .addCase(fetchSubCategories.pending, (state) => { state.subCatLoading = true; state.subCategories = []; })
            .addCase(fetchSubCategories.fulfilled, (state, action) => { state.subCatLoading = false; state.subCategories = action.payload; })
            .addCase(fetchSubCategories.rejected, (state, action) => { state.subCatLoading = false; state.error = action.payload; })
            // submit
            .addCase(submitReport.pending, (state) => { state.submitLoading = true; state.error = null; state.submitSuccess = false; })
            .addCase(submitReport.fulfilled, (state, action) => {
                state.submitLoading = false;
                state.submitSuccess = true;
                state.reportId = action.payload.data?.report_id;
            })
            .addCase(submitReport.rejected, (state, action) => { state.submitLoading = false; state.error = action.payload; });
    },
});

export const { clearReportState } = reportSlice.actions;
export default reportSlice.reducer;