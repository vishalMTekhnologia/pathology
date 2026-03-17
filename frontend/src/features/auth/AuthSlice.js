import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const registerUser = createAsyncThunk("auth/registerUser", async (formData, { rejectWithValue }) => {
    try { const response = await axios.post(`${BASE_URL}/api/v1/auth/register`, formData, { headers: { "Content-Type": "multipart/form-data" } }); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data?.message || "Registration failed."); }
});
export const loginUser = createAsyncThunk("auth/loginUser", async ({ identifier, password }, { rejectWithValue }) => {
    try { const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, { identifier, password }); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data?.message || "Invalid credentials."); }
});
const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, token: localStorage.getItem("token") || null, role: localStorage.getItem("role") || null, loading: false, error: null, success: false, loginSuccess: false },
    reducers: {
        logout(state) { state.user = null; state.token = null; state.role = null; state.error = null; state.success = false; state.loginSuccess = false; localStorage.clear(); },
        clearError(state) { state.error = null; },
        clearSuccess(state) { state.success = false; },
        clearLoginSuccess(state) { state.loginSuccess = false; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(registerUser.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; state.loginSuccess = false; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false; state.error = null;
                const data = action.payload;
                const token = data?.data?.accessToken || null;
                const refreshToken = data?.data?.refreshToken || null;
                if (token) { state.token = token; localStorage.setItem("token", token); }
                if (refreshToken) { localStorage.setItem("refreshToken", refreshToken); }
                state.loginSuccess = data.success === true || data.statusCode === 200;
            })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.loginSuccess = false; });
    },
});
export const { logout, clearError, clearSuccess, clearLoginSuccess } = authSlice.actions;
export default authSlice.reducer;
