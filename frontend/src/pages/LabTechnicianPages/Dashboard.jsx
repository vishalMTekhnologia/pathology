// PASTE YOUR LabTechnicianPages/Dashboard.jsx CODE HERE FROM THE CODE YOU SAVED IN NOTEPAD
// src/pages/LabTechnicianPages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import {
    FlaskConical, Clock, CheckCircle, Calendar,
    ArrowRight, Activity, Thermometer, Beaker,
    AlertCircle, TrendingUp, Users
} from "lucide-react";
import { useState, useEffect } from "react";

const statCards = [
    {
        label: "Pending Tests",
        value: 12,
        icon: <Clock size={24} />,
        color: "bg-amber-500",
        bg: "bg-amber-50",
        textColor: "text-amber-700",
        trend: "+2 from yesterday"
    },
    {
        label: "Tests In Progress",
        value: 5,
        icon: <Activity size={24} />,
        color: "bg-blue-500",
        bg: "bg-blue-50",
        textColor: "text-blue-700",
        trend: "3 active now"
    },
    {
        label: "Completed Reports",
        value: 28,
        icon: <CheckCircle size={24} />,
        color: "bg-green-500",
        bg: "bg-green-50",
        textColor: "text-green-700",
        trend: "+8 this week"
    },
    {
        label: "Today's Tests",
        value: 8,
        icon: <Calendar size={24} />,
        color: "bg-purple-500",
        bg: "bg-purple-50",
        textColor: "text-purple-700",
        trend: "4 remaining"
    },
];

// Recent test assignments
const recentTests = [
    { id: "T-1001", patient: "John Doe", test: "Complete Blood Count", priority: "High", time: "10:30 AM", status: "Pending" },
    { id: "T-1002", patient: "Jane Smith", test: "Lipid Profile", priority: "Normal", time: "11:15 AM", status: "In Progress" },
    { id: "T-1003", patient: "Robert Johnson", test: "Blood Glucose", priority: "High", time: "09:45 AM", status: "Completed" },
    { id: "T-1004", patient: "Emily Davis", test: "Thyroid Profile", priority: "Low", time: "12:00 PM", status: "Pending" },
    { id: "T-1005", patient: "Michael Wilson", test: "Urine Analysis", priority: "Normal", time: "02:30 PM", status: "Scheduled" },
];

// Equipment status
const equipmentStatus = [
    { name: "Hematology Analyzer", status: "Operational", usage: 78, icon: <Beaker size={16} /> },
    { name: "Centrifuge Machine", status: "In Use", usage: 100, icon: <Activity size={16} /> },
    { name: "Microscope", status: "Available", usage: 45, icon: <FlaskConical size={16} /> },
    { name: "Incubator", status: "Operational", usage: 62, icon: <Thermometer size={16} /> },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High": return "bg-red-100 text-red-700";
            case "Normal": return "bg-blue-100 text-blue-700";
            case "Low": return "bg-green-100 text-green-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed": return "bg-green-100 text-green-700";
            case "In Progress": return "bg-blue-100 text-blue-700";
            case "Pending": return "bg-amber-100 text-amber-700";
            case "Scheduled": return "bg-purple-100 text-purple-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="font-sans space-y-6">
            {/* Header with Welcome and Time */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Lab Technician Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome back, John! Here's your daily overview.
                    </p>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white 
                                  border border-gray-200 rounded-lg shadow-sm">
                        <Calendar size={16} className="text-cyan-600" />
                        <span className="text-sm text-gray-600">
                            {currentTime.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 
                                  border border-cyan-200 rounded-lg">
                        <Clock size={16} className="text-cyan-600" />
                        <span className="text-sm font-medium text-cyan-700">
                            {currentTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stat Cards Grid - 2x2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl border border-gray-200 p-6
                                 hover:shadow-lg transition-all duration-300
                                 group cursor-default relative overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className={`absolute top-0 right-0 w-24 h-24 
                                      ${card.bg} rounded-full -mr-8 -mt-8 
                                      opacity-50 group-hover:scale-150 
                                      transition-transform duration-500`}>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-4xl font-bold text-gray-800 
                                                group-hover:text-gray-900 transition-colors">
                                        {card.value}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">
                                        {card.label}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl ${card.bg} 
                                              flex items-center justify-center
                                              group-hover:scale-110 transition-transform
                                              ${card.textColor}`}>
                                    {card.icon}
                                </div>
                            </div>

                            {/* Trend Indicator */}
                            <div className="flex items-center gap-1.5 mt-2">
                                <TrendingUp size={14} className="text-gray-400" />
                                <span className="text-xs text-gray-500">
                                    {card.trend}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Tests - Takes 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 
                              overflow-hidden hover:shadow-lg transition-shadow">

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 
                                  flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-800 
                                     flex items-center gap-2">
                            <FlaskConical size={18} className="text-cyan-600" />
                            Today's Test Assignments
                        </h2>
                        <button
                            onClick={() => navigate("/technician-tests")}
                            className="text-xs font-medium text-cyan-600 
                                     hover:text-cyan-700 flex items-center gap-1
                                     hover:gap-2 transition-all">
                            View All <ArrowRight size={14} />
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-left text-xs 
                                               font-semibold text-gray-500 uppercase 
                                               tracking-wider">Test ID</th>
                                    <th className="px-6 py-3 text-left text-xs 
                                               font-semibold text-gray-500 uppercase 
                                               tracking-wider">Patient</th>
                                    <th className="px-6 py-3 text-left text-xs 
                                               font-semibold text-gray-500 uppercase 
                                               tracking-wider">Test Name</th>
                                    <th className="px-6 py-3 text-left text-xs 
                                               font-semibold text-gray-500 uppercase 
                                               tracking-wider">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs 
                                               font-semibold text-gray-500 uppercase 
                                               tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs 
                                               font-semibold text-gray-500 uppercase 
                                               tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentTests.map((test, i) => (
                                    <tr key={i} className="hover:bg-gray-50/80 
                                                         transition-colors group">
                                        <td className="px-6 py-3 font-mono text-xs 
                                                     text-gray-500">
                                            {test.id}
                                        </td>
                                        <td className="px-6 py-3 font-medium 
                                                     text-gray-800">
                                            {test.patient}
                                        </td>
                                        <td className="px-6 py-3 text-gray-600">
                                            {test.test}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`text-xs font-semibold 
                                                           px-2 py-1 rounded-full
                                                           ${getPriorityColor(test.priority)}`}>
                                                {test.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-500">
                                            {test.time}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`text-xs font-semibold 
                                                           px-2 py-1 rounded-full
                                                           ${getStatusColor(test.status)}`}>
                                                {test.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* View All Link */}
                    <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-200">
                        <button className="text-sm text-cyan-600 hover:text-cyan-700 
                                         font-medium flex items-center gap-1 group">
                            <span>Load more tests</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 
                                                           transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-5">

                    {/* Quick Actions Card */}
                    <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 
                                  rounded-xl p-5 text-white shadow-lg">
                        <h3 className="text-sm font-semibold text-cyan-100 mb-3">
                            Quick Actions
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => navigate("/technician-tests")}
                                className="w-full flex items-center justify-between
                                         bg-white/10 hover:bg-white/20 
                                         rounded-lg px-4 py-2.5 transition-colors
                                         border border-white/20">
                                <span className="text-sm font-medium">Start New Test</span>
                                <ArrowRight size={16} />
                            </button>
                            <button
                                onClick={() => navigate("/technician-report")}
                                className="w-full flex items-center justify-between
                                         bg-white/10 hover:bg-white/20 
                                         rounded-lg px-4 py-2.5 transition-colors
                                         border border-white/20">
                                <span className="text-sm font-medium">Enter Results</span>
                                <ArrowRight size={16} />
                            </button>
                            <button className="w-full flex items-center justify-between
                                             bg-white/10 hover:bg-white/20 
                                             rounded-lg px-4 py-2.5 transition-colors
                                             border border-white/20">
                                <span className="text-sm font-medium">Quality Check</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Equipment Status */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5
                                  hover:shadow-lg transition-shadow">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 
                                     flex items-center gap-2">
                            <Activity size={16} className="text-cyan-600" />
                            Equipment Status
                        </h3>
                        <div className="space-y-4">
                            {equipmentStatus.map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-cyan-600">
                                                {item.icon}
                                            </span>
                                            <span className="text-sm font-medium 
                                                           text-gray-700">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 
                                                        py-0.5 rounded-full
                                                        ${item.status === 'Operational'
                                                ? 'bg-green-100 text-green-700'
                                                : item.status === 'In Use'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 
                                                          rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full
                                                        ${item.status === 'Operational'
                                                            ? 'bg-green-500'
                                                            : item.status === 'In Use'
                                                                ? 'bg-blue-500'
                                                                : 'bg-gray-400'
                                                        }`}
                                                    style={{ width: `${item.usage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {item.usage}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="bg-amber-50 border border-amber-200 
                                  rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={18} className="text-amber-600 
                                                             flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-amber-800 
                                             mb-1">
                                    Quality Control Required
                                </h4>
                                <p className="text-xs text-amber-700">
                                    Hematology analyzer needs calibration in 2 hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Test Requests Button - Full Width */}
            <button
                onClick={() => navigate("/technician-tests")}
                className="w-full py-4 px-6 bg-cyan-600 text-white 
                         text-base font-semibold rounded-xl
                         hover:bg-cyan-700 active:bg-cyan-800 
                         transform hover:-translate-y-0.5 
                         transition-all duration-200
                         shadow-lg shadow-cyan-600/30
                         hover:shadow-xl
                         flex items-center justify-center gap-2
                         group"
            >
                <span>View All Test Requests</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 
                                                transition-transform" />
            </button>

            {/* Footer Stats */}

        </div>
    );
};

export default Dashboard;