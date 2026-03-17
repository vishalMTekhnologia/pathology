// src/pages/auth/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError, clearSuccess } from "../../features/auth/AuthSlice";
import {
    Phone, Lock, Eye, EyeOff, UserCog,
    FlaskConical, Shield, CheckCircle, AlertCircle,
    User, Mail, MapPin, Upload, UserPlus
} from "lucide-react";

const ROLES = [
    { id: "1", label: "Admin" },
    { id: "2", label: "Lab Technician" },
];

const Register = () => {
    const [form, setForm] = useState({
        role_id: "2", full_name: "", user_email: "", contact_no: "",
        address: "", user_password: "", confirmPassword: "", pro_pic: null,
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
            const timer = setTimeout(() => { dispatch(clearSuccess()); navigate("/login"); }, 1500);
            return () => clearTimeout(timer);
        }
    }, [success, navigate, dispatch]);

    useEffect(() => { return () => { dispatch(clearError()); dispatch(clearSuccess()); }; }, [dispatch]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setLocalError(""); dispatch(clearError());
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setForm(prev => ({ ...prev, pro_pic: file })); setPreview(URL.createObjectURL(file)); }
    };

    const handleRegister = () => {
        setLocalError("");
        const { role_id, full_name, user_email, contact_no, address, user_password, confirmPassword } = form;
        if (!full_name || !user_email || !contact_no || !address || !user_password || !confirmPassword) {
            setLocalError("Please fill in all required fields."); return;
        }
        if (!/^\d{10}$/.test(contact_no)) { setLocalError("Please enter a valid 10-digit contact number."); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user_email)) { setLocalError("Please enter a valid email address."); return; }
        if (user_password.length < 6) { setLocalError("Password must be at least 6 characters."); return; }
        if (user_password !== confirmPassword) { setLocalError("Passwords do not match."); return; }
        const formData = new FormData();
        formData.append("role_id", role_id); formData.append("full_name", full_name);
        formData.append("user_email", user_email); formData.append("contact_no", contact_no);
        formData.append("address", address); formData.append("user_password", user_password);
        if (form.pro_pic) formData.append("pro_pic", form.pro_pic);
        dispatch(registerUser(formData));
    };

    const displayError = localError || error;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4 font-sans">
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 w-full max-w-md shadow-2xl border border-white/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full"></div>
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center mx-auto mb-4 shadow-xl ring-4 ring-cyan-100">
                        <UserPlus size={34} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Create Account</h1>
                    <p className="text-sm text-gray-500">Register for Pathology Lab System</p>
                </div>
                {displayError && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                        <AlertCircle size={18} className="flex-shrink-0" /><span>{displayError}</span>
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3 mb-5">
                        <CheckCircle size={18} className="flex-shrink-0" /><span>Registration successful! Redirecting to login...</span>
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                    <div className="bg-gray-100 p-1 rounded-2xl">
                        <div className="flex gap-1">
                            {ROLES.map((r) => (
                                <button key={r.id} onClick={() => handleChange("role_id", r.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 ${form.role_id === r.id ? "bg-white text-cyan-600 shadow-lg" : "text-gray-500 hover:text-gray-700"}`}>
                                    {r.id === "1" ? <UserCog size={15} /> : <FlaskConical size={15} />}
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {[
                    { label: "Full Name", field: "full_name", type: "text", placeholder: "Enter full name", icon: <User size={18} /> },
                    { label: "Email", field: "user_email", type: "email", placeholder: "Enter email address", icon: <Mail size={18} /> },
                    { label: "Contact Number", field: "contact_no", type: "tel", placeholder: "Enter 10-digit contact number", icon: <Phone size={18} /> },
                ].map(({ label, field, type, placeholder, icon }) => (
                    <div className="mb-4" key={field}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-600 transition-colors">{icon}</div>
                            <input type={type} placeholder={placeholder} value={form[field]}
                                onChange={e => handleChange(field, field === "contact_no" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 transition-all outline-none placeholder:text-gray-400" />
                        </div>
                    </div>
                ))}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                    <div className="relative group">
                        <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-cyan-600"><MapPin size={18} /></div>
                        <textarea placeholder="Enter address" value={form.address} onChange={e => handleChange("address", e.target.value)} rows={2}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 transition-all outline-none placeholder:text-gray-400 resize-none" />
                    </div>
                </div>
                {[
                    { label: "Password", field: "user_password", show: showPassword, toggle: setShowPassword },
                    { label: "Confirm Password", field: "confirmPassword", show: showConfirm, toggle: setShowConfirm },
                ].map(({ label, field, show, toggle }) => (
                    <div className="mb-4" key={field}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-600"><Lock size={18} /></div>
                            <input type={show ? "text" : "password"} placeholder={`Enter ${label.toLowerCase()}`} value={form[field]}
                                onChange={e => handleChange(field, e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleRegister()}
                                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 transition-all outline-none placeholder:text-gray-400" />
                            <button type="button" onClick={() => toggle(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                ))}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Profile Picture <span className="text-gray-400 font-normal">(optional)</span></label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 group-hover:border-cyan-400 group-hover:bg-cyan-50 transition-all">
                            {preview ? <img src={preview} alt="preview" className="w-9 h-9 rounded-full object-cover border-2 border-cyan-200" /> :
                                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-400"><Upload size={16} /></div>}
                            <span className="text-sm text-gray-500 group-hover:text-cyan-600 transition-colors">{form.pro_pic ? form.pro_pic.name : "Click to upload photo"}</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                </div>
                <button onClick={handleRegister} disabled={loading || success}
                    className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-cyan-600/30 transform hover:-translate-y-0.5 transition-all duration-300 ${(loading || success) ? "cursor-not-allowed opacity-80" : "hover:shadow-xl"}`}>
                    {loading ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg><span>Registering...</span></> :
                        success ? <><CheckCircle size={18} /><span>Registered!</span></> :
                            <><UserPlus size={18} /><span>Create Account</span></>}
                </button>
                <p className="text-center text-sm text-gray-500 mt-5">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login")} className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">Sign in</button>
                </p>
            </div>
        </div>
    );
};

export default Register;
