// src/features/admin/PatientSlice.js
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

// ── Fetch all patients ────────────────────────────────────────────────────────
export const fetchPatients = createAsyncThunk(
    "patients/fetchPatients",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/petient/get`, {
                headers: authHeaders(),
            });
            // Handle array or single object in 'message' or 'data'
            if (Array.isArray(data.message)) return data.message;
            if (Array.isArray(data.data)) return data.data;
            if (data.message && typeof data.message === "object") return [data.message];
            if (data.data && typeof data.data === "object") return [data.data];
            return [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch patients");
        }
    }
);

// ── Add patient ───────────────────────────────────────────────────────────────
export const addPatient = createAsyncThunk(
    "patients/addPatient",
    async (patientData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/api/v1/petient/add`, patientData, {
                headers: authHeaders(),
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to add patient");
        }
    }
);

// ── Update patient ────────────────────────────────────────────────────────────
export const updatePatient = createAsyncThunk(
    "patients/updatePatient",
    async ({ id, ...patientData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${BASE_URL}/api/v1/petient/update/${id}`, patientData, {
                headers: authHeaders(),
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update patient");
        }
    }
);

// ── Delete patient ────────────────────────────────────────────────────────────
export const deletePatient = createAsyncThunk(
    "patients/deletePatient",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${BASE_URL}/api/v1/petient/delete/${id}`, {
                headers: authHeaders(),
            });
            return { id, ...data };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete patient");
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const patientSlice = createSlice({
    name: "patients",
    initialState: {
        patients: [],
        loading: false,
        actionLoading: false,
        error: null,
        actionError: null,
        success: false,
    },
    reducers: {
        resetPatientState(state) {
            state.error = null;
            state.actionError = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        // Fetch all
        builder
            .addCase(fetchPatients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatients.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.patients = payload;
            })
            .addCase(fetchPatients.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // Add
        builder
            .addCase(addPatient.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.success = false;
            })
            .addCase(addPatient.fulfilled, (state) => {
                state.actionLoading = false;
                state.success = true;
            })
            .addCase(addPatient.rejected, (state, { payload }) => {
                state.actionLoading = false;
                state.actionError = payload;
            });

        // Update
        builder
            .addCase(updatePatient.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.success = false;
            })
            .addCase(updatePatient.fulfilled, (state) => {
                state.actionLoading = false;
                state.success = true;
            })
            .addCase(updatePatient.rejected, (state, { payload }) => {
                state.actionLoading = false;
                state.actionError = payload;
            });

        // Delete
        builder
            .addCase(deletePatient.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(deletePatient.fulfilled, (state) => {
                state.actionLoading = false;
                state.success = true;
            })
            .addCase(deletePatient.rejected, (state, { payload }) => {
                state.actionLoading = false;
                state.actionError = payload;
            });
    },
});

export const { resetPatientState } = patientSlice.actions;
export default patientSlice.reducer;
