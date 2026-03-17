// src/pages/layout/Layout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const SIDEBAR_EXPANDED = 220;
const SIDEBAR_COLLAPSED = 68;

const Layout = () => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_EXPANDED);

    const handleToggle = () => {
        setSidebarWidth(prev =>
            prev === SIDEBAR_EXPANDED ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED
        );
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
            {/* Sidebar */}
            <Sidebar sidebarWidth={sidebarWidth} />

            {/* Main Area */}
            <div style={{
                marginLeft: sidebarWidth,
                marginTop: 65,
                flex: 1,
                transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
                padding: "24px",
                minHeight: "calc(100vh - 65px)",
            }}>
                <Outlet />
            </div>

            {/* Navbar */}
            <Navbar sidebarWidth={sidebarWidth} onToggle={handleToggle} />
        </div>
    );
};

export default Layout;
