// PASTE YOUR GenerateReport.jsx CODE HERE FROM THE CODE YOU SAVED IN NOTEPAD
// src/pages/LabTechnicianPages/GenerateReport.jsx
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import {
    FileText, Download, Printer, ArrowLeft,
    CheckCircle, AlertCircle, User, Calendar,
    Phone, Mail, Award, Shield, QrCode,
    Share2, Eye, X, Copy, Clock
} from "lucide-react";

const reportData = {
    labName: "ABC Pathology Lab",
    labAddress: "123 Main Street, City",
    labPhone: "+1 234 567 8900",
    labEmail: "info@abcpathlab.com",
    registrationNo: "LAB-REG-2025-0042",
    accreditation: "NABL Accredited · ISO 15189:2012",
    patientName: "John Doe",
    ageGender: "45/M",
    mobile: "+1234567890",
    email: "john.doe@email.com",
    patientId: "PT-2025-00128",
    reportDate: "2026-03-06",
    collectionDate: "2026-03-05",
    collectionTime: "09:30 AM",
    reportTime: "02:15 PM",
    referralDoctor: "Dr. Smith",
    doctorRegNo: "MCI-12345",
    testName: "Complete Blood Count (CBC)",
    testCode: "LAB-101",
    sampleType: "Blood (EDTA)",
    sampleId: "SMP-2026-03-05-0042",
    parameters: [
        { parameter: "Hemoglobin", result: "14.2", unit: "g/dL", normalRange: "12-16", flag: "normal", method: "Cyanmethemoglobin" },
        { parameter: "RBC Count", result: "5.0", unit: "million/μL", normalRange: "4.5-5.5", flag: "normal", method: "Impedance" },
        { parameter: "WBC Count", result: "7.5", unit: "thousand/μL", normalRange: "4-11", flag: "normal", method: "Flow Cytometry" },
        { parameter: "Platelets", result: "250", unit: "thousand/μL", normalRange: "150-400", flag: "normal", method: "Impedance" },
        { parameter: "Hematocrit (HCT)", result: "42", unit: "%", normalRange: "40-50", flag: "normal", method: "Calculated" },
        { parameter: "MCV", result: "86", unit: "fL", normalRange: "80-100", flag: "normal", method: "Calculated" },
    ],
    comments: "All parameters are within normal reference ranges. No significant abnormalities detected.",
    interpretation: "Normal CBC profile",
    pathologist: {
        name: "Dr. Sarah Johnson",
        qualification: "MD Pathology",
        signature: "dr_sarah_signature",
        licenseNo: "LIC-789012"
    },
    reviewedBy: "Dr. Michael Chen",
    equipmentUsed: "Hematology Analyzer XD-40",
    barcode: "CBC-2026-03-06-001",
};

const GenerateReport = () => {
    const navigate = useNavigate();
    const [showPreview, setShowPreview] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [copied, setCopied] = useState(false);
    const reportRef = useRef(null);

    const handleGenerate = () => {
        window.print();
    };

    const handleDownload = () => {
        // In a real app, this would generate a PDF
        alert("PDF download started. In production, this would generate a professional PDF.");
    };

    const handleEmail = () => {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Lab Report',
                text: `Test Report for ${reportData.patientName}`,
                url: window.location.href,
            });
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getFlagColor = (flag) => {
        switch (flag) {
            case "high": return "text-red-600 bg-red-50";
            case "low": return "text-blue-600 bg-blue-50";
            default: return "text-green-600 bg-green-50";
        }
    };

    const getFlagIcon = (flag) => {
        switch (flag) {
            case "high": return <AlertCircle size={14} className="text-red-600" />;
            case "low": return <AlertCircle size={14} className="text-blue-600" />;
            default: return <CheckCircle size={14} className="text-green-600" />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 bg-gradient-to-br 
                      from-gray-50 to-slate-50 min-h-screen font-sans">

            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center 
                          sm:justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/technician-tests")}
                        className="p-2 hover:bg-white rounded-lg transition-colors 
                                 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Report Generation
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Preview and generate patient test report
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 
                                 bg-white border border-gray-200 rounded-lg
                                 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <Eye size={16} />
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 text-gray-600 bg-white border border-gray-200 
                                 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Share"
                    >
                        <Share2 size={16} />
                    </button>
                    <button
                        onClick={handleCopyLink}
                        className="p-2 text-gray-600 bg-white border border-gray-200 
                                 rounded-lg hover:bg-gray-50 transition-colors relative"
                        title="Copy link"
                    >
                        <Copy size={16} />
                        {copied && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 
                                           bg-gray-800 text-white text-xs px-2 py-1 
                                           rounded whitespace-nowrap">
                                Copied!
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Success Messages */}
            {emailSent && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 
                              rounded-lg flex items-center gap-3 animate-slideDown">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-sm text-green-700 font-medium">
                        Report sent successfully to patient's email!
                    </span>
                </div>
            )}

            {/* Report Preview Toggle */}
            {showPreview && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 
                              rounded-lg flex items-center gap-3">
                    <AlertCircle size={20} className="text-amber-600" />
                    <span className="text-sm text-amber-700">
                        Preview mode - This is how the report will appear when printed.
                    </span>
                </div>
            )}

            {/* Main Report Card */}
            <div ref={reportRef} className="bg-white rounded-xl border border-gray-200 
                                          shadow-xl overflow-hidden mb-6">

                {/* Report Header with Lab Info */}
                <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center 
                                  sm:justify-between text-white">
                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm 
                                          rounded-xl flex items-center justify-center">
                                <FileText size={28} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{reportData.labName}</h2>
                                <p className="text-sm text-cyan-100 mt-0.5">
                                    {reportData.labAddress}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Report Meta Info */}


                {/* Patient Details */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 
                                 flex items-center gap-2">
                        <User size={16} className="text-cyan-600" />
                        Patient Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-24">Patient Name:</span>
                                <span className="text-sm font-medium text-gray-800">
                                    {reportData.patientName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-24">Patient ID:</span>
                                <span className="text-sm text-gray-600">
                                    {reportData.patientId}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-24">Age/Gender:</span>
                                <span className="text-sm text-gray-600">
                                    {reportData.ageGender}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-24">Mobile:</span>
                                <span className="text-sm text-gray-600">
                                    {reportData.mobile}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-24">Email:</span>
                                <span className="text-sm text-gray-600">
                                    {reportData.email}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-24">Sample ID:</span>
                                <span className="text-sm font-mono text-gray-600">
                                    {reportData.sampleId}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referral Doctor */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-500">Referral Doctor:</span>
                            <span className="text-sm font-medium text-gray-800">
                                {reportData.referralDoctor}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500">
                            Reg No: {reportData.doctorRegNo}
                        </span>
                    </div>
                </div>

                {/* Test Information */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-800 
                                     flex items-center gap-2">
                            <FileText size={16} className="text-cyan-600" />
                            Test Results - {reportData.testName}
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="text-xs bg-gray-100 text-gray-600 
                                           px-2 py-1 rounded-full">
                                {reportData.testCode}
                            </span>
                            <span className="text-xs bg-cyan-100 text-cyan-700 
                                           px-2 py-1 rounded-full">
                                {reportData.sampleType}
                            </span>
                        </div>
                    </div>

                    {/* Parameters Table */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs 
                                               font-semibold text-gray-600 
                                               uppercase tracking-wider">
                                        Parameter
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs 
                                               font-semibold text-gray-600 
                                               uppercase tracking-wider">
                                        Result
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs 
                                               font-semibold text-gray-600 
                                               uppercase tracking-wider">
                                        Unit
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs 
                                               font-semibold text-gray-600 
                                               uppercase tracking-wider">
                                        Normal Range
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs 
                                               font-semibold text-gray-600 
                                               uppercase tracking-wider">
                                        Method
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs 
                                               font-semibold text-gray-600 
                                               uppercase tracking-wider">
                                        Flag
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reportData.parameters.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 
                                                         transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {row.parameter}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            <span className={`px-2 py-1 rounded-md text-sm
                                                ${row.flag === 'normal'
                                                    ? 'text-gray-800'
                                                    : row.flag === 'high'
                                                        ? 'text-red-700 bg-red-50'
                                                        : 'text-blue-700 bg-blue-50'
                                                }`}>
                                                {row.result}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {row.unit}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 font-mono">
                                            {row.normalRange}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {row.method}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className={`inline-flex items-center gap-1 
                                                          px-2 py-1 rounded-full text-xs
                                                          ${getFlagColor(row.flag)}`}>
                                                {getFlagIcon(row.flag)}
                                                <span className="capitalize">{row.flag}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Comments & Interpretation */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 
                                         uppercase tracking-wider mb-2">
                                Comments
                            </h4>
                            <p className="text-sm text-gray-700 bg-gray-50 
                                       p-3 rounded-lg">
                                {reportData.comments}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 
                                         uppercase tracking-wider mb-2">
                                Interpretation
                            </h4>
                            <p className="text-sm text-gray-700 bg-gray-50 
                                       p-3 rounded-lg">
                                {reportData.interpretation}
                            </p>
                        </div>
                    </div>
                </div>



                {/* Signatures */}
                <div className="p-6">


                    {/* Signature Placeholder */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400">
                                    This is a computer generated report. Valid without signature.
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Report generated by: TECH-123 • John Smith
                                </p>
                            </div>
                            <div className="w-32 h-12 bg-gray-100 rounded 
                                          flex items-center justify-center">
                                <span className="text-xs text-gray-400">
                                    [Signature]
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <button
                    onClick={handleGenerate}
                    className="col-span-2 px-6 py-4 bg-cyan-600 text-white 
                             rounded-xl text-sm font-semibold hover:bg-cyan-700 
                             active:bg-cyan-800 transform hover:-translate-y-0.5 
                             transition-all duration-200 shadow-lg shadow-cyan-600/30
                             flex items-center justify-center gap-2"
                >
                    <Printer size={18} />
                    Print Report
                </button>

                <button
                    onClick={handleDownload}
                    className="px-6 py-4 bg-white text-gray-700 border border-gray-200 
                             rounded-xl text-sm font-semibold hover:bg-gray-50 
                             transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Download size={18} />
                    Download PDF
                </button>

                <button
                    onClick={handleEmail}
                    className="px-6 py-4 bg-white text-gray-700 border border-gray-200 
                             rounded-xl text-sm font-semibold hover:bg-gray-50 
                             transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Mail size={18} />
                    Email Report
                </button>
            </div>

            {/* Cancel Button */}
            <button
                onClick={() => navigate("/technician-tests")}
                className="w-full mt-3 px-6 py-4 bg-gray-500 text-white 
                         rounded-xl text-sm font-semibold hover:bg-gray-600 
                         active:bg-gray-700 transition-all duration-200
                         flex items-center justify-center gap-2"
            >
                <ArrowLeft size={18} />
                Back to Test List
            </button>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-gray-400 border-t 
                          border-gray-200 pt-4">
                <p>© 2026 {reportData.labName}. All rights reserved.</p>
                <p className="mt-1">This report is confidential and intended only for the patient.</p>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes slideDown {
                    0% { opacity: 0; transform: translateY(-10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default GenerateReport;