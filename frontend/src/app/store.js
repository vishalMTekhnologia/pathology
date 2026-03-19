import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import profileReducer from "../features/profile/profileSlice";
import doctorReducer from "../features/admin/AddDoctorSlice";
import updateDoctorReducer from "../features/admin/UpdateDoctorSlice";
import getDoctorsReducer from "../features/admin/GetDoctorsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        doctor: doctorReducer,
        doctorUpdate: updateDoctorReducer,
        doctorList: getDoctorsReducer,
    }
});

export default store;
