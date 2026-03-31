import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import profileReducer from "../features/profile/profileSlice";
import doctorReducer from "../features/admin/AddDoctorSlice";
import updateDoctorReducer from "../features/admin/UpdateDoctorSlice";
import getDoctorsReducer from "../features/admin/GetDoctorsSlice";
import bloodCollectorsReducer from "../features/admin/employeesSlice";
import testReducer from "../features/admin/TestSlice";
import categoryReducer from "../features/admin/CategorySlice";
import patientReducer from "../features/admin/PatientSlice";
import subCategoriesReducer from "../features/admin/SubCategorySlice";   // ← add this
import reportReducer from "../features/report/reportSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        doctor: doctorReducer,
        doctorUpdate: updateDoctorReducer,
        doctorList: getDoctorsReducer,
        employees: bloodCollectorsReducer,
        tests: testReducer,
        categories: categoryReducer,
        patients: patientReducer,
        subCategories: subCategoriesReducer,   // ← add this
        report: reportReducer,
    }
});

export default store;
