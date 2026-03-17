// src/pages/AdminPages/Dashboard.jsx
import { Syringe, Users, Stethoscope, FileText, CheckCircle, ArrowUpRight, Clock } from "lucide-react";
const statCards = [
    { label: "Total Blood Collector Boys", value: 12, icon: <Syringe size={22} />, color: "#818cf8", bg: "#ede9fe" },
    { label: "Total Lab Technicians", value: 8, icon: <Users size={22} />, color: "#60a5fa", bg: "#dbeafe" },
    { label: "Total Doctors", value: 5, icon: <Stethoscope size={22} />, color: "#34d399", bg: "#d1fae5" },
    { label: "Pending Reports", value: 23, icon: <FileText size={22} />, color: "#fb923c", bg: "#ffedd5" },
    { label: "Completed Reports", value: 156, icon: <CheckCircle size={22} />, color: "#2dd4bf", bg: "#ccfbf1" },
];
const recentActivity = [
    { title: "New blood sample collected", sub: "John Doe", time: "10 minutes ago" },
    { title: "Report generated for patient", sub: "Jane Smith", time: "25 minutes ago" },
    { title: "New employee added", sub: "Dr. Robert Brown", time: "1 hour ago" },
    { title: "Test parameters updated", sub: "Admin", time: "2 hours ago" },
    { title: "Quality check completed", sub: "Lab Technician", time: "3 hours ago" },
];
const quickStats = [
    { label: "Today's Collections", value: 18, change: "+12%", trend: "up" },
    { label: "Avg. Report Time", value: "2.4h", change: "-8%", trend: "down" },
    { label: "Patient Satisfaction", value: "94%", change: "+5%", trend: "up" },
];
const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Welcome to Pathology Lab Admin Panel</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 group cursor-default">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.label}</p>
                            <p className="text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">{card.value}</p>
                            <div className="flex items-center gap-1 text-xs text-green-600 font-medium"><ArrowUpRight size={14} /><span>+8% from last month</span></div>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: card.bg, color: card.color }}>{card.icon}</div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2"><Clock size={18} className="text-cyan-600" />Recent Activity</h2>
                            <button className="text-xs font-medium text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 px-3 py-1.5 rounded-lg transition-colors">View All</button>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentActivity.map((act, i) => (
                            <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/80 transition-colors duration-200 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{act.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{act.sub}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">{act.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-5">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Statistics</h3>
                        <div className="space-y-4">
                            {quickStats.map((stat, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                                        <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{stat.change} </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-sm font-semibold text-cyan-100 mb-3">Lab Performance</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1"><span>Today's Target</span><span>78%</span></div>
                                <div className="w-full bg-cyan-500/30 rounded-full h-2"><div className="bg-white rounded-full h-2" style={{ width: '78%' }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1"><span>Weekly Goal</span><span>92%</span></div>
                                <div className="w-full bg-cyan-500/30 rounded-full h-2"><div className="bg-white rounded-full h-2" style={{ width: '92%' }}></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
