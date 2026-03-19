// src/pages/layout/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Users, FlaskConical,
    Settings, UserCircle, ChevronRight,
    ClipboardList, FileText, Beaker, Stethoscope
} from "lucide-react";

const adminLinks = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { label: "Employees", icon: <Users size={18} />, path: "/employees" },
    { label: "Test Management", icon: <Beaker size={18} />, path: "/test-management" },
    { label: "Pathology Details", icon: <FlaskConical size={18} />, path: "/pathology-details" },
    // { label: "Profile", icon: <UserCircle size={18} />, path: "/profile" },
    { label: "Refer Doctor", icon: <Stethoscope size={18} />, path: "/refer-doctor" },
];

const technicianLinks = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/technician-dashboard" },
    { label: "Tests", icon: <ClipboardList size={18} />, path: "/technician-tests" },
    { label: "Generate Report", icon: <FileText size={18} />, path: "/technician-report" },
    { label: "Profile", icon: <UserCircle size={18} />, path: "/technician-profile" },
];

const Sidebar = ({ sidebarWidth = 220 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";
    const collapsed = sidebarWidth <= 68;

    const links = isAdmin ? adminLinks : technicianLinks;

    return (
        <aside style={{
            position: "fixed",
            top: 65,
            left: 0,
            bottom: 0,
            width: sidebarWidth,
            background: "#ffffff",
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden",
            zIndex: 900,
            boxShadow: "1px 0 4px rgba(0,0,0,0.03)",
        }}>
            {/* Nav Links */}
            <nav style={{ padding: "12px 8px", flex: 1 }}>
                {links.map((link) => {
                    const isActive = location.pathname === link.path ||
                        (link.path !== "/dashboard" && link.path !== "/technician-dashboard" &&
                            location.pathname.startsWith(link.path));

                    return (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            title={collapsed ? link.label : ""}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: collapsed ? "10px 0" : "10px 12px",
                                justifyContent: collapsed ? "center" : "flex-start",
                                borderRadius: 10,
                                border: "none",
                                cursor: "pointer",
                                marginBottom: 2,
                                background: isActive
                                    ? "linear-gradient(135deg, #e0f2fe, #cffafe)"
                                    : "transparent",
                                color: isActive ? "#0891b2" : "#6b7280",
                                fontWeight: isActive ? 600 : 400,
                                fontSize: 13,
                                transition: "all 0.15s",
                                position: "relative",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                            }}
                            onMouseEnter={e => {
                                if (!isActive) e.currentTarget.style.background = "#f9fafb";
                            }}
                            onMouseLeave={e => {
                                if (!isActive) e.currentTarget.style.background = "transparent";
                            }}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <div style={{
                                    position: "absolute", left: 0, top: "20%", bottom: "20%",
                                    width: 3, borderRadius: "0 3px 3px 0",
                                    background: "#0891b2",
                                }} />
                            )}

                            <span style={{ flexShrink: 0 }}>{link.icon}</span>

                            {!collapsed && (
                                <span style={{
                                    flex: 1, textAlign: "left",
                                    opacity: collapsed ? 0 : 1,
                                    transition: "opacity 0.2s",
                                }}>
                                    {link.label}
                                </span>
                            )}

                            {!collapsed && isActive && (
                                <ChevronRight size={14} style={{ flexShrink: 0 }} />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Badge */}
            {!collapsed && (
                <div style={{
                    padding: "12px 16px",
                    borderTop: "1px solid #f0f0f0",
                    margin: "0 8px 8px",
                    borderRadius: 10,
                    background: isAdmin ? "#e0f2fe" : "#e0f2fe",
                }}>
                    <p style={{
                        fontSize: 11, fontWeight: 700,
                        color: isAdmin ? "#0891b2" : "#0891b2",
                        textTransform: "uppercase", letterSpacing: "0.5px",
                        marginBottom: 2,
                    }}>
                        {isAdmin ? "Admin Panel" : "Technician Portal"}
                    </p>
                    <p style={{ fontSize: 10, color: "#9ca3af" }}>
                        Pathology Lab v1.0
                    </p>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
