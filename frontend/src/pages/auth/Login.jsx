// src/pages/auth/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError, clearLoginSuccess } from "../../features/auth/AuthSlice";
import {
    Phone, Lock, Eye, EyeOff, LogIn, UserCog,
    FlaskConical, Shield, AlertCircle, CheckCircle
} from "lucide-react";

const Login = () => {
    const [role, setRole] = useState("admin");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, loginSuccess } = useSelector((state) => state.auth);

    useEffect(() => {
        if (loginSuccess) {
            dispatch(clearLoginSuccess());
            if (role === "admin") {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/technician-dashboard", { replace: true });
            }
        }
    }, [loginSuccess, role, navigate, dispatch]);

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const handleRoleSwitch = (newRole) => {
        setRole(newRole);
        setIdentifier("");
        setPassword("");
        dispatch(clearError());
    };

    const handleLogin = () => {
        if (!identifier || !password) return;
        localStorage.setItem("role", role);
        if (rememberMe) {
            localStorage.setItem("rememberedIdentifier", identifier);
        }
        dispatch(loginUser({ identifier, password }));
    };

    const isAdmin = role === "admin";

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50
                      flex items-center justify-center p-4 font-sans">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200 rounded-full
                              mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full
                              mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10
                          w-full max-w-md shadow-2xl border border-white/20
                          transform hover:scale-[1.02] transition-all duration-500">

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5
                              bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full"></div>

                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700
                                      flex items-center justify-center mx-auto mb-4 shadow-xl
                                      transform hover:rotate-3 transition-transform duration-300 ring-4 ring-cyan-100">
                            <FlaskConical size={34} className="text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5
                                      bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">
                        Pathology Lab
                    </h1>
                    <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
                                   text-xs font-bold uppercase tracking-wider
                                   ${isAdmin ? 'bg-cyan-100 text-cyan-700' : 'bg-blue-100 text-blue-700'}`}>
                        {isAdmin ? <UserCog size={14} /> : <FlaskConical size={14} />}
                        {isAdmin ? "Admin Panel" : "Technician Portal"}
                    </div>
                </div>

                <div className="bg-gray-100 p-1 rounded-2xl mb-6">
                    <div className="flex gap-1">
                        {["admin", "technician"].map((r) => (
                            <button key={r} onClick={() => handleRoleSwitch(r)}
                                className={`flex-1 flex items-center justify-center gap-2
                                         py-2.5 px-3 rounded-xl text-sm font-semibold
                                         transition-all duration-300 relative overflow-hidden
                                         ${role === r ? 'bg-white text-cyan-600 shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}>
                                {r === "admin" ? <UserCog size={16} /> : <FlaskConical size={16} />}
                                {r === "admin" ? "Admin" : "Technician"}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200
                                  text-red-600 text-sm rounded-xl px-4 py-3 mb-6 animate-slideDown">
                        <AlertCircle size={18} className="flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Mobile Number / Email
                    </label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400
                                      group-focus-within:text-cyan-600 transition-colors duration-200">
                            <Phone size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Enter mobile number or email"
                            value={identifier}
                            onChange={e => setIdentifier(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleLogin()}
                            className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl
                                     text-sm text-gray-800 bg-gray-50 focus:border-cyan-500
                                     focus:bg-white focus:ring-4 focus:ring-cyan-100
                                     transition-all duration-200 outline-none placeholder:text-gray-400"
                        />
                        {identifier.length >= 10 && (
                            <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400
                                      group-focus-within:text-cyan-600 transition-colors duration-200">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleLogin()}
                            className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl
                                     text-sm text-gray-800 bg-gray-50 focus:border-cyan-500
                                     focus:bg-white focus:ring-4 focus:ring-cyan-100
                                     transition-all duration-200 outline-none placeholder:text-gray-400"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                                     hover:text-gray-600 transition-colors duration-200">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-cyan-600
                                     focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                            Remember me
                        </span>
                    </label>
                    <button className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">
                        Forgot Password?
                    </button>
                </div>

                <button onClick={handleLogin}
                    disabled={loading || !identifier || !password}
                    className={`w-full relative overflow-hidden group flex items-center justify-center gap-2
                             bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-bold text-sm
                             py-3.5 rounded-xl shadow-lg shadow-cyan-600/30
                             transform hover:-translate-y-0.5 transition-all duration-300
                             ${(loading || !identifier || !password)
                            ? 'cursor-not-allowed opacity-70'
                            : 'hover:shadow-xl'}`}>
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <>
                            <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                            <span>{isAdmin ? "Login as Admin" : "Login as Technician"}</span>
                        </>
                    )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-5">
                    Don't have an account?{" "}
                    <button onClick={() => navigate("/register")}
                        className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">
                        Register
                    </button>
                </p>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0,0) scale(1); }
                    33% { transform: translate(30px,-50px) scale(1.1); }
                    66% { transform: translate(-20px,20px) scale(0.9); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer { animation: shimmer 2s infinite; }
                @keyframes slideDown {
                    0% { opacity: 0; transform: translateY(-10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-slideDown { animation: slideDown 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default Login;
