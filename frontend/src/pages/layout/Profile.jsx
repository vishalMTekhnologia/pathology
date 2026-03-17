// src/pages/layout/Profile.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../features/profile/profileSlice";
import { logout } from "../../features/auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import {
    UserCircle, Mail, Phone, MapPin, Shield,
    LogOut, FlaskConical, Loader2, AlertCircle,
    BadgeCheck, Calendar, Hash
} from "lucide-react";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);

    useEffect(() => {
        const userId = authUser?.user_id || localStorage.getItem("user_id") || 2;
        dispatch(getProfile(userId));
    }, [dispatch, authUser]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] flex-col gap-3">
                <Loader2 size={32} className="text-cyan-600 animate-spin" />
                <p className="text-gray-500 text-sm">Loading profile...</p>
            </div>
        );
    }

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

    if (!user) return null;

    const isAdmin = user.role_id === 1 || user.role_name === "Admin";
    const accentColor = isAdmin ? "#0891b2" : "#7c3aed";
    const accentGrad = isAdmin ? "from-cyan-600 to-cyan-700" : "from-violet-600 to-violet-700";
    const accentBg = isAdmin ? "bg-cyan-50" : "bg-violet-50";
    const accentBorder = isAdmin ? "border-cyan-200" : "border-violet-200";
    const accentText = isAdmin ? "text-cyan-700" : "text-violet-700";
    const accentIcon = isAdmin ? "text-cyan-600" : "text-violet-600";

    const gridCards = [
        { label: "Full Name", value: user.full_name, icon: <UserCircle size={18} /> },
        { label: "Email", value: user.user_email, icon: <Mail size={18} /> },
        { label: "Contact", value: user.contact_no, icon: <Phone size={18} /> },
        { label: "Address", value: user.address, icon: <MapPin size={18} /> },
        { label: "Role", value: user.role_name, icon: <Shield size={18} /> },
        {
            label: "Status",
            value: user.user_status === "1" ? "Active" : "Inactive",
            icon: <BadgeCheck size={18} />,
            isStatus: true,
            active: user.user_status === "1",
        },
        {
            label: "Member Since",
            value: user.created_at
                ? new Date(user.created_at * 1000).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                })
                : "—",
            icon: <Calendar size={18} />,
        },
        { label: "User ID", value: `#${user.user_id}`, icon: <Hash size={18} /> },
    ];

    return (
        <div className="flex items-start justify-center py-6 px-4">
            <div className="w-full max-w-2xl space-y-5">
                {/* Hero Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className={`h-24 bg-gradient-to-br ${accentGrad} relative overflow-hidden`}>
                        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
                        <div className="absolute right-8 bottom-0 w-20 h-20 rounded-full bg-white/10" />
                    </div>
                    <div className="px-8 pt-5 pb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-16 h-16 rounded-2xl ${accentBg} border-2 ${accentBorder} flex items-center justify-center shadow-md flex-shrink-0`}>
                                {user.pro_pic ? (
                                    <img src={`${import.meta.env.VITE_BASE_URL}/${user.pro_pic}`} alt="Profile" className="w-full h-full rounded-xl object-cover" />
                                ) : (
                                    <UserCircle size={36} style={{ color: accentColor }} />
                                )}
                            </div>
                            <button onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white transition-all duration-200">
                                <LogOut size={15} /> Logout
                            </button>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">{user.full_name || "—"}</h1>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${accentBg} ${accentText} border ${accentBorder}`}>
                            {isAdmin ? <Shield size={11} /> : <FlaskConical size={11} />}
                            {user.role_name || "—"}
                        </span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-800">Profile Information</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100">
                        {gridCards.map((card, i) => (
                            <div key={i} className="bg-white px-6 py-5 flex items-start gap-4 hover:bg-gray-50/60 transition-colors duration-150">
                                <div className={`w-9 h-9 rounded-xl ${accentBg} ${accentIcon} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    {card.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{card.label}</p>
                                    {card.isStatus ? (
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${card.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${card.active ? "bg-green-500" : "bg-red-500"}`} />
                                            {card.value}
                                        </span>
                                    ) : (
                                        <p className="text-sm font-medium text-gray-800 break-words">{card.value || "—"}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
