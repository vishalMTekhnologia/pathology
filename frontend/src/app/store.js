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
import subCategoriesReducer from "../features/admin/SubCategorySlice";
import bloodCollectionReducer from "../features/admin/BloodCollectionSlice";
import reportsReducer from "../features/admin/ReportSlice"; // Rename this to avoid conflict

// If you have a report slice from features/report, keep it with a different name
// import oldReportReducer from "../features/report/reportSlice";

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
        subCategories: subCategoriesReducer,
        bloodCollection: bloodCollectionReducer,
        reports: reportsReducer, // Use the renamed variable
        // If you need both report slices:
        // oldReport: oldReportReducer,
        // reports: reportsReducer,
    }
});

export default store;