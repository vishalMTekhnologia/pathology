// src/features/admin/employeesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

const BASE_URL       = import.meta.env.VITE_BASE_URL;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY; // 64-char hex → 32 bytes
const STATIC_KEY     = import.meta.env.VITE_STATIC_KEY;     // 32-char hex → 16 bytes IV

// ── Auth header helper ────────────────────────────────────────────────────────
const authHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// ── Decryption helper ─────────────────────────────────────────────────────────
const decryptField = (encryptedHex) => {
    try {
        if (!encryptedHex) return "";
        const key          = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);
        const iv           = CryptoJS.enc.Hex.parse(STATIC_KEY);
        const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(encryptedHex),
        });
        const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch {
        return encryptedHex; // fallback: return raw value
    }
};

// ── Shared mapper (same shape for both roles) ─────────────────────────────────
const mapEmployee = (item) => ({
    id:     item.lab_user_id,
    userId: item.user_id,
    name:   decryptField(item.full_name),
    email:  decryptField(item.user_email),
    mobile: decryptField(item.contact_no),
    gender: "",       // not returned by API
    dob:    "",       // not returned by API
    idType: "",       // not returned by API
    status: "Active", // default; API doesn't return status
});

// ── Thunk: Blood Collectors ───────────────────────────────────────────────────
export const fetchBloodCollectors = createAsyncThunk(
    "employees/fetchBloodCollectors",
    async (_, { rejectWithValue }) => {
        try {
            const { data: json } = await axios.get(
                `${BASE_URL}/api/v1/users/get-blood-boys`,
                { headers: authHeaders() }
            );
            if (json.success && Array.isArray(json.data)) {
                return json.data.map(mapEmployee);
            }
            return rejectWithValue(json.message || "Unexpected response");
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch blood collectors"
            );
        }
    }
);

// ── Thunk: Lab Technicians ────────────────────────────────────────────────────
export const fetchLabTechnicians = createAsyncThunk(
    "employees/fetchLabTechnicians",
    async (_, { rejectWithValue }) => {
        try {
            const { data: json } = await axios.get(
                `${BASE_URL}/api/v1/users/get-technician`,
                { headers: authHeaders() }
            );
            if (json.success && Array.isArray(json.data)) {
                return json.data.map(mapEmployee);
            }
            return rejectWithValue(json.message || "Unexpected response");
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch lab technicians"
            );
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const employeesSlice = createSlice({
    name: "employees",
    initialState: {
        bloodCollectors: { data: [], loading: false, error: null },
        labTechnicians:  { data: [], loading: false, error: null },
    },
    reducers: {
        // ── Blood Collectors ──────────────────────────────────────────────────
        updateBloodCollector(state, { payload }) {
            state.bloodCollectors.data = state.bloodCollectors.data.map((e) =>
                e.id === payload.id ? { ...e, ...payload } : e
            );
        },
        deleteBloodCollector(state, { payload }) {
            state.bloodCollectors.data = state.bloodCollectors.data.filter(
                (e) => e.id !== payload
            );
        },
        addBloodCollector(state, { payload }) {
            state.bloodCollectors.data.push(payload);
        },
        resetBloodCollectorsError(state) {
            state.bloodCollectors.error = null;
        },

        // ── Lab Technicians ───────────────────────────────────────────────────
        updateLabTechnician(state, { payload }) {
            state.labTechnicians.data = state.labTechnicians.data.map((e) =>
                e.id === payload.id ? { ...e, ...payload } : e
            );
        },
        deleteLabTechnician(state, { payload }) {
            state.labTechnicians.data = state.labTechnicians.data.filter(
                (e) => e.id !== payload
            );
        },
        addLabTechnician(state, { payload }) {
            state.labTechnicians.data.push(payload);
        },
        resetLabTechniciansError(state) {
            state.labTechnicians.error = null;
        },
    },
    extraReducers: (builder) => {
        // Blood Collectors
        builder
            .addCase(fetchBloodCollectors.pending, (state) => {
                state.bloodCollectors.loading = true;
                state.bloodCollectors.error   = null;
            })
            .addCase(fetchBloodCollectors.fulfilled, (state, { payload }) => {
                state.bloodCollectors.loading = false;
                state.bloodCollectors.data    = payload;
            })
            .addCase(fetchBloodCollectors.rejected, (state, { payload }) => {
                state.bloodCollectors.loading = false;
                state.bloodCollectors.error   = payload;
            });

        // Lab Technicians
        builder
            .addCase(fetchLabTechnicians.pending, (state) => {
                state.labTechnicians.loading = true;
                state.labTechnicians.error   = null;
            })
            .addCase(fetchLabTechnicians.fulfilled, (state, { payload }) => {
                state.labTechnicians.loading = false;
                state.labTechnicians.data    = payload;
            })
            .addCase(fetchLabTechnicians.rejected, (state, { payload }) => {
                state.labTechnicians.loading = false;
                state.labTechnicians.error   = payload;
            });
    },
});

export const {
    updateBloodCollector, deleteBloodCollector, addBloodCollector, resetBloodCollectorsError,
    updateLabTechnician,  deleteLabTechnician,  addLabTechnician,  resetLabTechniciansError,
} = employeesSlice.actions;

export default employeesSlice.reducer;