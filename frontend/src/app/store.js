import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import profileReducer from "../features/profile/profileSlice";
import doctorReducer from "../features/admin/AddDoctorSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        doctor: doctorReducer,
    }
});
export default store;
