// src/pages/layout/Profile.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../features/profile/profileSlice";
import { logout } from "../../features/auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import {
    UserCircle, Mail, Phone, MapPin, Shield,
    LogOut, FlaskConical, Loader2, AlertCircle,
    BadgeCheck, Calendar, Hash, User, Clock
} from "lucide-react";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.profile);

    useEffect(() => {
        // Just dispatch getProfile - no userId needed
        // The backend will get the user ID from the token
        dispatch(getProfile());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] flex-col gap-3">
                <Loader2 size={32} className="text-cyan-600 animate-spin" />
                <p className="text-gray-500 text-sm">Loading profile...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-6 py-4">
                    <AlertCircle size={20} className="text-red-500" />
                    <span className="text-red-600 text-sm">{error}</span>
                </div>
            </div>
        );
    }

    // Don't render anything if no user data
    if (!user) return null;

    // Determine if user is admin for styling
    const isAdmin = user.role_id === 2 || user.role_name === "Admin";
    const accentGrad = isAdmin ? "from-cyan-600 to-cyan-500" : "from-cyan-600 to-cyan-500";
    const accentBg = isAdmin ? "bg-cyan-50" : "bg-cyan-50";
    const accentBorder = isAdmin ? "border-cyan-200" : "border-cyan-200";
    const accentText = isAdmin ? "text-cyan-700" : "text-cyan-700";
    const accentColor = isAdmin ? "#0891b2" : "#0891b2";
    const accentIcon = isAdmin ? "text-cyan-600" : "text-cyan-600";
    const accentShadow = isAdmin ? "shadow-cyan-500/25" : "shadow-cyan-500/25";
    const accentIconBg = isAdmin ? "bg-cyan-100" : "bg-cyan-100";

    // Stats row data
    const statsRow = [
        // { label: "User ID", value: `#${user.user_id}`, icon: <Hash size={18} />, color: "text-violet-600", bg: "bg-violet-50" },
        { label: "Role", value: user.role_name || "—", icon: <Shield size={18} />, color: isAdmin ? "text-cyan-600" : "text-violet-600", bg: accentBg },
        { label: "Status", value: user.user_status === "1" ? "Active" : "Inactive", icon: <BadgeCheck size={18} />, color: "text-emerald-600", bg: "bg-emerald-50" },
        {
            label: "Member Since",
            value: user.created_at
                ? new Date(user.created_at * 1000).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                : "—",
            icon: <Calendar size={18} />,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
    ];

    return (
        <div className="font-sans min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
                        <p className="text-sm text-gray-500 mt-1">View and manage your account details</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500
                                 border border-red-200 rounded-xl text-sm font-semibold
                                 hover:bg-red-500 hover:text-white transition-all duration-200
                                 shadow-sm hover:-translate-y-0.5"
                    >
                        <LogOut size={15} /> Logout
                    </button>
                </div>

                {/* Hero Banner */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Banner gradient */}
                    <div className={`h-28 bg-gradient-to-r ${accentGrad} relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                                backgroundSize: "40px 40px"
                            }} />
                        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10" />
                        <div className="absolute right-24 bottom-0 w-24 h-24 rounded-full bg-white/10" />
                    </div>

                    {/* Profile Identity */}
                    <div className="flex flex-col items-center text-center px-6 pt-6 pb-8 -mt-10 relative">
                        <div className={`w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-xl
                                        ${accentShadow} flex items-center justify-center mb-4`}>
                            <div className={`w-full h-full rounded-xl ${accentBg} flex items-center justify-center`}>
                                {user.pro_pic ? (
                                    <img
                                        src={`${import.meta.env.VITE_BASE_URL}/${user.pro_pic}`}
                                        alt="Profile"
                                        className="w-full h-full rounded-xl object-cover"
                                    />
                                ) : (
                                    <UserCircle size={36} style={{ color: accentColor }} />
                                )}
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.full_name || "—"}</h2>

                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                            <Mail size={13} className="flex-shrink-0" style={{ color: accentColor }} />
                            {user.user_email || "—"}
                        </p>

                        {/* Role badge */}
                        {/* <div className={`mt-3 inline-flex items-center gap-2 ${accentBg} ${accentBorder}
                                        border ${accentText} text-xs font-semibold px-3 py-1.5 rounded-full`}>
                            {isAdmin ? <Shield size={12} /> : <FlaskConical size={12} />}
                            {user.role_name || "—"}
                        </div> */}
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 border-t border-gray-100">
                        {statsRow.map((stat, i) => (
                            <div key={i}
                                className={`flex flex-col items-center justify-center py-5 gap-2
                                           ${i < statsRow.length - 1 ? "border-r border-gray-100" : ""}
                                           hover:bg-gray-50/60 transition-colors`}>
                                <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color}
                                               flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact & Account Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg ${accentIconBg} flex items-center justify-center`}>
                                <Phone size={14} style={{ color: accentColor }} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800">Contact Information</h3>
                        </div>
                        <div className="p-6 space-y-5">

                            {/* Phone */}
                            <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-xl ${accentBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    <Phone size={15} style={{ color: accentColor }} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                                    <p className="text-sm font-medium text-gray-800">{user.contact_no || "—"}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-xl ${accentBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    <Mail size={15} style={{ color: accentColor }} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                    <p className="text-sm font-medium text-gray-800 break-all">{user.user_email || "—"}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-xl ${accentBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    <MapPin size={15} style={{ color: accentColor }} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Address</p>
                                    <p className="text-sm font-medium text-gray-800 leading-relaxed">{user.address || "—"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                                <Shield size={14} className="text-violet-600" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800">Account Details</h3>
                        </div>
                        <div className="p-6 space-y-5">

                            {/* Role */}
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Shield size={15} className="text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Role</p>
                                    <p className="text-sm font-medium text-gray-800">{user.role_name || "—"}</p>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <BadgeCheck size={15} className="text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Account Status</p>
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full
                                                     ${user.user_status === "1"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-600"}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.user_status === "1" ? "bg-green-500" : "bg-red-500"}`} />
                                        {user.user_status === "1" ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>

                            {/* Member Since */}
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Calendar size={15} className="text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                                    <p className="text-sm font-medium text-gray-800">
                                        {user.created_at
                                            ? new Date(user.created_at * 1000).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "long", year: "numeric",
                                            })
                                            : "—"}
                                    </p>
                                </div>
                            </div>

                            {/* User ID */}
                            {/* <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Hash size={15} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">User ID</p>
                                    <p className="text-sm font-medium text-gray-800">#{user.user_id}</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;