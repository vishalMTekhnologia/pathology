// PASTE YOUR AdminRegister.jsx CODE HERE FROM THE CODE YOU SAVED IN NOTEPAD
// src/pages/AdminPages/AdminRegister.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError, clearSuccess } from "../../features/auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import {
    Phone, Lock, Eye, EyeOff, UserCog,
    Droplets, CheckCircle, AlertCircle,
    User, Mail, MapPin, Upload, UserPlus, ArrowLeft, ChevronRight
} from "lucide-react";

const ROLES = [
    { id: "3", label: "Lab Technician", icon: <UserCog size={16} />, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200", activeBg: "bg-cyan-600" },
    { id: "4", label: "Blood Collector Boy", icon: <Droplets size={16} />, color: "text-cyan-500", bg: "bg-cyan-50", border: "border-cyan-200", activeBg: "bg-cyan-500" },
];

const AdminRegister = () => {
    const [form, setForm] = useState({
        role_id: "3",
        full_name: "",
        user_email: "",
        contact_no: "",
        address: "",
        user_password: "",
        confirmPassword: "",
        pro_pic: null,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [preview, setPreview] = useState(null);
    const [localError, setLocalError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, success } = useSelector((state) => state.auth);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                dispatch(clearSuccess());
                navigate("/employees");
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [success, navigate, dispatch]);

    useEffect(() => {
        return () => { dispatch(clearError()); dispatch(clearSuccess()); };
    }, [dispatch]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setLocalError("");
        dispatch(clearError());
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, pro_pic: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRegister = () => {
        setLocalError("");
        const { role_id, full_name, user_email, contact_no, address, user_password, confirmPassword } = form;
        if (!full_name || !user_email || !contact_no || !address || !user_password || !confirmPassword) {
            setLocalError("Please fill in all required fields."); return;
        }
        if (!/^\d{10}$/.test(contact_no)) { setLocalError("Enter a valid 10-digit contact number."); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user_email)) { setLocalError("Enter a valid email address."); return; }
        if (user_password.length < 6) { setLocalError("Password must be at least 6 characters."); return; }
        if (user_password !== confirmPassword) { setLocalError("Passwords do not match."); return; }

        const formData = new FormData();
        formData.append("role_id", role_id);
        formData.append("full_name", full_name);
        formData.append("user_email", user_email);
        formData.append("contact_no", contact_no);
        formData.append("address", address);
        formData.append("user_password", user_password);
        if (form.pro_pic) formData.append("pro_pic", form.pro_pic);
        dispatch(registerUser(formData));
    };

    const displayError = localError || error;
    const selectedRole = ROLES.find(r => r.id === form.role_id);

    return (
        <div className="flex items-start justify-center py-4 px-4 font-sans">
            <div className="w-full max-w-2xl space-y-5">

                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/employees")}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Register Employee</h1>
                        <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-0.5">
                            <span>Employees</span>
                            <ChevronRight size={14} />
                            <span className="text-cyan-600 font-medium">Register</span>
                        </div>
                    </div>
                </div>

                {/* Role Selector */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <p className="text-sm font-bold text-gray-700 mb-3">
                        Select Role <span className="text-red-500">*</span>
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {ROLES.map((r) => (
                            <button key={r.id} onClick={() => handleChange("role_id", r.id)}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                                    ${form.role_id === r.id
                                        ? `${r.bg} ${r.border} ${r.color}`
                                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                    ${form.role_id === r.id ? r.bg : "bg-white"} border
                                    ${form.role_id === r.id ? r.border : "border-gray-200"}`}>
                                    <span className={form.role_id === r.id ? r.color : "text-gray-400"}>
                                        {r.icon}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{r.label}</p>
                                    <p className="text-xs opacity-60">Role ID: {r.id}</p>
                                </div>
                                {form.role_id === r.id && (
                                    <CheckCircle size={16} className={`flex-shrink-0 ${r.color}`} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-800">Employee Details</h2>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Error / Success */}
                        {displayError && (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                                <AlertCircle size={16} className="flex-shrink-0" />
                                <span>{displayError}</span>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3">
                                <CheckCircle size={16} className="flex-shrink-0" />
                                <span>{selectedRole?.label} registered successfully! Redirecting...</span>
                            </div>
                        )}

                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                <input type="text" placeholder="Enter full name" value={form.full_name}
                                    onChange={e => handleChange("full_name", e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all placeholder:text-gray-300" />
                            </div>
                        </div>

                        {/* Email + Contact */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                    <input type="email" placeholder="email@example.com" value={form.user_email}
                                        onChange={e => handleChange("user_email", e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all placeholder:text-gray-300" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Contact <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                    <input type="tel" placeholder="10-digit number" value={form.contact_no}
                                        onChange={e => handleChange("contact_no", e.target.value.replace(/\D/g, "").slice(0, 10))}
                                        className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all placeholder:text-gray-300" />
                                    {form.contact_no.length === 10 && (
                                        <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <MapPin size={15} className="absolute left-3 top-3 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                <textarea placeholder="Enter address" value={form.address}
                                    onChange={e => handleChange("address", e.target.value)}
                                    rows={2}
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all placeholder:text-gray-300 resize-none" />
                            </div>
                        </div>

                        {/* Password + Confirm */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                    <input type={showPassword ? "text" : "password"} placeholder="Min 6 characters"
                                        value={form.user_password}
                                        onChange={e => handleChange("user_password", e.target.value)}
                                        className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all placeholder:text-gray-300" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                    <input type={showConfirm ? "text" : "password"} placeholder="Re-enter password"
                                        value={form.confirmPassword}
                                        onChange={e => handleChange("confirmPassword", e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleRegister()}
                                        className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all placeholder:text-gray-300" />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Profile Picture */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Profile Picture <span className="text-gray-400 font-normal normal-case">(optional)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="flex-1 flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 group-hover:border-cyan-400 group-hover:bg-cyan-50 transition-all duration-200">
                                    {preview ? (
                                        <img src={preview} alt="preview" className="w-9 h-9 rounded-full object-cover border-2 border-cyan-200" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <Upload size={15} />
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-500 group-hover:text-cyan-600 transition-colors">
                                        {form.pro_pic ? form.pro_pic.name : "Click to upload photo"}
                                    </span>
                                </div>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                        <button onClick={() => navigate("/employees")}
                            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleRegister} disabled={loading || success}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-lg
                                ${form.role_id === "4" ? "bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/20" : "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20"}
                                ${(loading || success) ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"}`}>
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Registering...
                                </>
                            ) : success ? (
                                <><CheckCircle size={15} /> Registered!</>
                            ) : (
                                <><UserPlus size={15} /> Register {selectedRole?.label}</>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminRegister;