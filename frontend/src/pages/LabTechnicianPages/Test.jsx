// PASTE YOUR Test.jsx CODE HERE FROM THE CODE YOU SAVED IN NOTEPAD
// src/pages/LabTechnicianPages/Test.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    User, Phone, FlaskConical, Droplets,
    Calendar, UserCog, AlertCircle, CheckCircle2,
    Save, ChevronRight
} from "lucide-react";

const patientInfo = {
    patientName: "John Doe",
    ageGender: "45 / M",
    mobile: "+1234567890",
    testName: "Complete Blood Count",
    sampleType: "Blood",
    collectionDate: "2026-03-05",
    referralDoctor: "Dr. Smith",
    priority: "Normal",
    status: "Pending",
};

const initialParameters = [
    { parameter: "Hemoglobin", unit: "g/dL", normalRange: "12–16", result: "", remark: "" },
    { parameter: "RBC Count", unit: "million/μL", normalRange: "4.5–5.5", result: "", remark: "" },
    { parameter: "WBC Count", unit: "thousand/μL", normalRange: "4–11", result: "", remark: "" },
    { parameter: "Platelets", unit: "thousand/μL", normalRange: "150–400", result: "", remark: "" },
];

const infoGrid = [
    { label: "Patient Name", value: patientInfo.patientName, icon: <User size={16} /> },
    { label: "Age / Gender", value: patientInfo.ageGender, icon: <User size={16} /> },
    { label: "Mobile", value: patientInfo.mobile, icon: <Phone size={16} /> },
    { label: "Test Name", value: patientInfo.testName, icon: <FlaskConical size={16} /> },
    { label: "Sample Type", value: patientInfo.sampleType, icon: <Droplets size={16} /> },
    { label: "Collection Date", value: patientInfo.collectionDate, icon: <Calendar size={16} /> },
    { label: "Referral Doctor", value: patientInfo.referralDoctor, icon: <UserCog size={16} /> },
    {
        label: "Priority",
        value: patientInfo.priority,
        icon: <AlertCircle size={16} />,
        badge: true,
        badgeColor: patientInfo.priority === "Urgent"
            ? "bg-red-100 text-red-700"
            : "bg-blue-100 text-blue-700",
    },
    {
        label: "Status",
        value: patientInfo.status,
        icon: <CheckCircle2 size={16} />,
        badge: true,
        badgeColor: patientInfo.status === "Pending"
            ? "bg-amber-100 text-amber-700"
            : "bg-green-100 text-green-700",
    },
];

const Test = () => {
    const [parameters, setParameters] = useState(initialParameters);
    const navigate = useNavigate();

    const handleChange = (index, field, value) => {
        const updated = [...parameters];
        updated[index][field] = value;
        setParameters(updated);
    };

    const handleSave = () => {
        navigate("/technician-report");
    };

    return (
        <div className="flex items-start justify-center py-4 px-4 font-sans">
            <div className="w-full max-w-3xl space-y-5">

                {/* ── Page Header ── */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Test Details</h1>
                    <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1">
                        <span>Tests</span>
                        <ChevronRight size={14} />
                        <span className="text-cyan-600 font-medium">Enter Result</span>
                    </div>
                </div>

                {/* ── Patient Info Grid ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                        <User size={16} className="text-cyan-600" />
                        <h2 className="text-sm font-bold text-gray-800">Patient Information</h2>
                    </div>

                    {/* 2-column grid — same style as Profile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100">
                        {infoGrid.map((item, i) => (
                            <div key={i}
                                className="bg-white px-5 py-4 flex items-start gap-3
                                         hover:bg-gray-50/60 transition-colors duration-150">
                                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600
                                               flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {item.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        {item.label}
                                    </p>
                                    {item.badge ? (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full
                                                         text-xs font-semibold ${item.badgeColor}`}>
                                            {item.value}
                                        </span>
                                    ) : (
                                        <p className="text-sm font-medium text-gray-800">{item.value || "—"}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Enter Test Result ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-cyan-600 to-cyan-700
                                  flex items-center gap-2">
                        <FlaskConical size={16} className="text-white" />
                        <h2 className="text-sm font-bold text-white">Enter Test Result</h2>
                    </div>

                    {/* Patient summary */}
                    <div className="mx-5 mt-5 mb-4 px-4 py-3 bg-cyan-50 border border-cyan-100 rounded-xl
                                  flex items-center gap-6 flex-wrap">
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Patient</p>
                            <p className="text-sm font-bold text-gray-800">{patientInfo.patientName}</p>
                        </div>
                        <div className="w-px h-8 bg-cyan-200 hidden sm:block" />
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Test</p>
                            <p className="text-sm font-bold text-gray-800">{patientInfo.testName}</p>
                        </div>
                    </div>

                    {/* Parameters Table */}
                    <div className="mx-5 mb-5 rounded-xl border border-gray-100 overflow-hidden">

                        {/* Table Header */}
                        <div className="grid grid-cols-[2fr_1fr_1.2fr_1.2fr_1fr] bg-gray-50
                                      border-b border-gray-200 px-4 py-3 gap-3">
                            {["Parameter", "Result", "Unit", "Normal Range", "Remark"].map((h) => (
                                <span key={h} className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {h}
                                </span>
                            ))}
                        </div>

                        {/* Table Rows */}
                        {parameters.map((row, i) => (
                            <div key={i}
                                className={`grid grid-cols-[2fr_1fr_1.2fr_1.2fr_1fr] px-4 py-3 gap-3
                                          items-center
                                          ${i < parameters.length - 1 ? "border-b border-gray-100" : ""}
                                          hover:bg-gray-50/60 transition-colors`}>

                                {/* Parameter name */}
                                <span className="text-sm font-medium text-gray-700">{row.parameter}</span>

                                {/* Result input */}
                                <input
                                    type="text"
                                    value={row.result}
                                    placeholder="—"
                                    onChange={e => handleChange(i, "result", e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg
                                             text-sm text-gray-800 bg-gray-50
                                             focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100
                                             outline-none transition-all placeholder:text-gray-300"
                                />

                                {/* Unit */}
                                <span className="text-sm text-gray-500">{row.unit}</span>

                                {/* Normal Range */}
                                <span className="text-sm text-gray-500">{row.normalRange}</span>

                                {/* Remark input */}
                                <input
                                    type="text"
                                    value={row.remark}
                                    placeholder="—"
                                    onChange={e => handleChange(i, "remark", e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg
                                             text-sm text-gray-800 bg-gray-50
                                             focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100
                                             outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Save Button */}
                    <div className="px-5 pb-5">
                        <button
                            onClick={handleSave}
                            className="w-full flex items-center justify-center gap-2
                                     py-3.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800
                                     text-white font-semibold text-sm rounded-xl
                                     transition-all duration-200 shadow-lg shadow-cyan-600/30
                                     hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            <Save size={16} />
                            Save Result
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Test;