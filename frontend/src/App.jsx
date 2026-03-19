import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./pages/layout/Layout";
import Profile from "./pages/layout/Profile";
import Dashboard from "./pages/AdminPages/Dashboard";
import Employees from "./pages/AdminPages/Employees";
import AdminRegister from "./pages/AdminPages/AdminRegister";
import TestManagement from "./pages/AdminPages/TestManagement";
import PathologyDetails from "./pages/AdminPages/PathologyDetails";
import TechDashboard from "./pages/LabTechnicianPages/Dashboard";
import TechTest from "./pages/LabTechnicianPages/Test";
import GenerateReport from "./pages/LabTechnicianPages/GenerateReport";
import DoctorManagement from "./pages/AdminPages/DoctorManagement";
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/register" element={<AdminRegister />} />
          <Route path="test-management" element={<TestManagement />} />
          <Route path="pathology-details" element={<PathologyDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="technician-dashboard" element={<TechDashboard />} />
          <Route path="technician-tests" element={<TechTest />} />
          <Route path="technician-report" element={<GenerateReport />} />
          <Route path="technician-profile" element={<Profile />} />
          <Route path="refer-doctor" element={<DoctorManagement />} />

        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
