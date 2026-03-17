import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { decryptUserProfile } from "../../utils/decrypt";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const getProfile = createAsyncThunk("profile/getProfile", async (userId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/v1/auth/get-profile/${userId}`, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
        const rawUser = response.data.data;
        const decryptedUser = decryptUserProfile(rawUser);
        return decryptedUser;
    } catch (error) { return rejectWithValue(error.response?.data?.message || "Failed to fetch profile."); }
});
const profileSlice = createSlice({
    name: "profile",
    initialState: { user: null, loading: false, error: null },
    reducers: { clearProfile(state) { state.user = null; state.error = null; } },
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getProfile.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(getProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});
export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
