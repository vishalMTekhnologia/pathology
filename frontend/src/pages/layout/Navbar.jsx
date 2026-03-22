// src/pages/layout/Navbar.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../features/profile/profileSlice";
import { UserCircle, FlaskConical, Menu, Shield } from "lucide-react";

const isEncrypted = (val) => {
    if (!val || typeof val !== "string") return false;
    return val.length >= 32 && /^[a-f0-9]+$/i.test(val) && !val.includes("@") && !val.includes(" ");
};

const Navbar = ({ sidebarWidth = 220, onToggle }) => {
    const collapsed = sidebarWidth <= 68;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user: authUser } = useSelector((state) => state.auth);
    const { user: profileUser } = useSelector((state) => state.profile);

    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";

    useEffect(() => {
        const userId = authUser?.user_id || localStorage.getItem("user_id") || 2;
        dispatch(getProfile(userId));
    }, [dispatch, authUser]);

    const handleProfileClick = () => {
        navigate(isAdmin ? "/profile" : "/technician-profile");
    };

    const rawName = profileUser?.full_name;
    const displayName = rawName && !isEncrypted(rawName)
        ? rawName.split(" ")[0]
        : (isAdmin ? "Admin" : "Technician");

    const displayRole = profileUser?.role_name || (isAdmin ? "Admin" : "Lab Technician");

    return (
        <header style={{
            position: "fixed", top: 0, left: 0, right: 0,
            height: 65,
            background: "#ffffff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex", alignItems: "center",
            zIndex: 1000,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
            {/* Logo Section */}
            <div style={{
                width: sidebarWidth, minWidth: sidebarWidth,
                height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 12px", gap: 10,
                borderRight: "1px solid #f0f0f0",
                transition: "width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s",
                overflow: "hidden", flexShrink: 0,
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "linear-gradient(135deg, #0891b2, #0e7490)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <FlaskConical size={18} color="white" />
                </div>

                <div style={{
                    opacity: collapsed ? 0 : 1,
                    maxWidth: collapsed ? 0 : 200,
                    overflow: "hidden",
                    transition: "opacity 0.2s, max-width 0.25s",
                    whiteSpace: "nowrap",
                }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                        Pathology Lab
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.2 }}>
                        {isAdmin ? "Admin Panel" : "Technician Portal"}
                    </div>
                </div>
            </div>

            {/* Right Area */}
            <div style={{
                flex: 1, display: "flex", alignItems: "center",
                justifyContent: "space-between", padding: "0 20px",
            }}>
                {/* Hamburger */}
                <button onClick={onToggle} style={{
                    width: 36, height: 36,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "none", border: "1.5px solid #e5e7eb",
                    borderRadius: 8, cursor: "pointer", color: "#6b7280",
                    transition: "all 0.2s", flexShrink: 0,
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#0891b2"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "#0891b2"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                >
                    <Menu size={17} />
                </button>

                {/* Profile Button */}
                <button onClick={handleProfileClick} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "none", border: "1px solid #f0f0f0",
                    cursor: "pointer", padding: "6px 12px",
                    borderRadius: 10, transition: "background 0.15s",
                }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                    <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: isAdmin ? "#e0f2fe" : "#ede9fe",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        {profileUser?.pro_pic ? (
                            <img
                                src={`${import.meta.env.VITE_BASE_URL}/${profileUser.pro_pic}`}
                                alt="avatar"
                                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                            />
                        ) : (
                                <UserCircle size={20} color={isAdmin ? "#0891b2" : "#0891b2"} />
                        )}
                    </div>

                    <div style={{ textAlign: "left", lineHeight: 1.3 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                            {displayName}
                        </div>
                        <div style={{
                            fontSize: 10, color: isAdmin ? "#0891b2" : "#0891b2",
                            fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
                            display: "flex", alignItems: "center", gap: 3,
                        }}>
                            {isAdmin ? <Shield size={9} /> : <FlaskConical size={9} />}
                            {displayRole}
                        </div>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
