// src/pages/LabTechnicianPages/GenerateReport.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
    FileText, Download, Printer, ArrowLeft,
    CheckCircle, AlertCircle, User, Calendar,
    Phone, Mail, Award, Shield, QrCode,
    Share2, Eye, X, Copy, Clock, FlaskRound as Flask, Stethoscope, Microscope
} from "lucide-react";

// Helper function to get flag status based on result vs normal range
const getFlag = (result, min, max) => {
    if (result === undefined || result === null || result === "") return "normal";
    const numResult = parseFloat(result);
    if (isNaN(numResult)) return "normal";
    if (max !== undefined && numResult > max) return "high";
    if (min !== undefined && numResult < min) return "low";
    return "normal";
};

// Mock patient and report metadata (in real app, this comes from API/context)
const getReportMetadata = () => ({
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
    reportDate: new Date().toISOString().split('T')[0],
    collectionDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    collectionTime: "09:30 AM",
    reportTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    referralDoctor: "Dr. Smith",
    doctorRegNo: "MCI-12345",
    sampleType: "Blood (EDTA)",
    sampleId: `SMP-${Date.now()}`,
    pathologist: {
        name: "Dr. Sarah Johnson",
        qualification: "MD Pathology",
        licenseNo: "LIC-789012"
    },
    reviewedBy: "Dr. Michael Chen",
    equipmentUsed: "Hematology Analyzer XD-40",
});

// Mock test results for each sub-category (in real app, comes from API)
const getMockResults = () => ({
    // Sample type (non-numeric)
    "Sample": "Whole Blood",
    // Hemoglobin
    "Hemoglobin(HB)": 14.5,
    // RBC COUNT
    "Total RBC count": 5.2,
    // BLOOD INDICES
    "Pack Cell Volume(PCV)": 45,
    "Mean Corpuscular Volume(MCV)": 87,
    "MCH": 29,
    "MCHC": 33.5,
    "RDW": 13,
    // WBC COUNT
    "Total WBC Count": 7500,
    // DIFFERENTIAL WBC COUNT (mock values)
    "Neutrophils": 65,
    "Lymphocytes": 25,
    "Monocytes": 6,
    "Eosinophils": 3,
    "Basophils": 1,
    // PLATELET COUNT
    "Platelet Count": 280,
});

const GenerateReport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const reportRef = useRef(null);

    // Get test data from location state (passed from previous page)
    // Fallback to the provided API data if not passed
    const testData = location.state?.testData || {
        "test_id": 1,
        "test_code": "A1",
        "test_name": "CBC Test",
        "test_description": "Blood test",
        "categories": [
            {
                "price": 20,
                "category_id": 7,
                "category_name": "PLATELET COUNT",
                "sub_categories": []
            },
            {
                "price": 20,
                "category_id": 6,
                "category_name": "DIFFRENTIAL WBC COUNT",
                "sub_categories": []
            },
            {
                "price": 20,
                "category_id": 5,
                "category_name": "WBC COUNT",
                "sub_categories": [
                    {
                        "unit": "cumm",
                        "sub_category_id": 9,
                        "normal_range_max": 11000,
                        "normal_range_min": 4000,
                        "sub_category_name": "Total WBC Count"
                    }
                ]
            },
            {
                "price": 20,
                "category_id": 4,
                "category_name": "BLOOD INDICES",
                "sub_categories": [
                    {
                        "unit": "%",
                        "sub_category_id": 4,
                        "normal_range_max": 50,
                        "normal_range_min": 40,
                        "sub_category_name": "Pack Cell Volume(PCV)"
                    },
                    {
                        "unit": "fL",
                        "sub_category_id": 5,
                        "normal_range_max": 101,
                        "normal_range_min": 83,
                        "sub_category_name": "Mean Corpuscular Volume(MCV)"
                    },
                    {
                        "unit": "pg",
                        "sub_category_id": 6,
                        "normal_range_max": 32,
                        "normal_range_min": 27,
                        "sub_category_name": "MCH"
                    },
                    {
                        "unit": "g/dL",
                        "sub_category_id": 7,
                        "normal_range_max": 35,
                        "normal_range_min": 33,
                        "sub_category_name": "MCHC"
                    },
                    {
                        "unit": "%",
                        "sub_category_id": 8,
                        "normal_range_max": 14,
                        "normal_range_min": 12,
                        "sub_category_name": "RDW"
                    }
                ]
            },
            {
                "price": 20,
                "category_id": 3,
                "category_name": "RBC COUNT",
                "sub_categories": [
                    {
                        "unit": "mill/cumm",
                        "sub_category_id": 3,
                        "normal_range_max": 6,
                        "normal_range_min": 5,
                        "sub_category_name": "Total RBC count"
                    }
                ]
            },
            {
                "price": 20,
                "category_id": 2,
                "category_name": "HEMOGLOBIN",
                "sub_categories": [
                    {
                        "unit": "g/dl",
                        "sub_category_id": 2,
                        "normal_range_max": 17,
                        "normal_range_min": 13,
                        "sub_category_name": "Hemoglobin(HB)"
                    }
                ]
            },
            {
                "price": 100,
                "category_id": 1,
                "category_name": "Sample type",
                "sub_categories": [
                    {
                        "unit": "00",
                        "sub_category_id": 1,
                        "normal_range_max": 0,
                        "normal_range_min": 0,
                        "sub_category_name": "Sample"
                    }
                ]
            }
        ]
    };

    const metadata = getReportMetadata();
    const mockResults = getMockResults();

    // Build parameters array from categories and sub_categories
    const buildParameters = () => {
        const params = [];

        testData.categories.forEach(category => {
            // Handle sample type category specially (non-numeric)
            if (category.category_name === "Sample type" && category.sub_categories.length > 0) {
                const sub = category.sub_categories[0];
                const resultValue = mockResults[sub.sub_category_name] || "Whole Blood";
                params.push({
                    parameter: sub.sub_category_name,
                    result: resultValue,
                    unit: "",
                    normalRange: "N/A",
                    flag: "normal",
                    method: "Visual Inspection",
                    category: category.category_name
                });
            }
            // Handle platelet count (no sub-categories, need to add manually)
            else if (category.category_name === "PLATELET COUNT" && category.sub_categories.length === 0) {
                params.push({
                    parameter: "Platelet Count",
                    result: mockResults["Platelet Count"] || 280,
                    unit: "thousand/μL",
                    normalRange: "150-400",
                    flag: getFlag(mockResults["Platelet Count"], 150, 400),
                    method: "Impedance",
                    category: category.category_name
                });
            }
            // Handle differential WBC count (no sub-categories, add manually)
            else if (category.category_name === "DIFFRENTIAL WBC COUNT" && category.sub_categories.length === 0) {
                const differentials = [
                    { name: "Neutrophils", result: mockResults["Neutrophils"] || 65, unit: "%", range: "40-80", method: "Flow Cytometry" },
                    { name: "Lymphocytes", result: mockResults["Lymphocytes"] || 25, unit: "%", range: "20-40", method: "Flow Cytometry" },
                    { name: "Monocytes", result: mockResults["Monocytes"] || 6, unit: "%", range: "2-10", method: "Flow Cytometry" },
                    { name: "Eosinophils", result: mockResults["Eosinophils"] || 3, unit: "%", range: "1-6", method: "Flow Cytometry" },
                    { name: "Basophils", result: mockResults["Basophils"] || 1, unit: "%", range: "0-2", method: "Flow Cytometry" }
                ];
                differentials.forEach(diff => {
                    const [min, max] = diff.range.split('-').map(Number);
                    params.push({
                        parameter: diff.name,
                        result: diff.result,
                        unit: diff.unit,
                        normalRange: diff.range,
                        flag: getFlag(diff.result, min, max),
                        method: diff.method,
                        category: category.category_name
                    });
                });
            }
            // Handle categories with sub_categories
            else if (category.sub_categories && category.sub_categories.length > 0) {
                category.sub_categories.forEach(sub => {
                    const resultValue = mockResults[sub.sub_category_name];
                    const min = sub.normal_range_min;
                    const max = sub.normal_range_max;
                    const flag = getFlag(resultValue, min, max);

                    params.push({
                        parameter: sub.sub_category_name,
                        result: resultValue !== undefined ? resultValue : "—",
                        unit: sub.unit === "00" ? "" : sub.unit,
                        normalRange: min !== 0 || max !== 0 ? `${min}-${max}` : "N/A",
                        flag: flag,
                        method: getMethodForParameter(sub.sub_category_name),
                        category: category.category_name
                    });
                });
            }
        });

        return params;
    };

    const getMethodForParameter = (paramName) => {
        const methods = {
            "Hemoglobin(HB)": "Cyanmethemoglobin",
            "Total RBC count": "Impedance",
            "Total WBC Count": "Flow Cytometry",
            "Pack Cell Volume(PCV)": "Calculated",
            "Mean Corpuscular Volume(MCV)": "Calculated",
            "MCH": "Calculated",
            "MCHC": "Calculated",
            "RDW": "Calculated",
            "Neutrophils": "Flow Cytometry",
            "Lymphocytes": "Flow Cytometry",
            "Monocytes": "Flow Cytometry",
            "Eosinophils": "Flow Cytometry",
            "Basophils": "Flow Cytometry",
            "Platelet Count": "Impedance"
        };
        return methods[paramName] || "Standard Method";
    };

    const parameters = buildParameters();

    // Generate comments based on abnormal flags
    const generateComments = () => {
        const abnormalParams = parameters.filter(p => p.flag !== "normal" && p.parameter !== "Sample");
        if (abnormalParams.length === 0) {
            return "All parameters are within normal reference ranges. No significant abnormalities detected.";
        }
        return `Note: ${abnormalParams.map(p => `${p.parameter} (${p.flag})`).join(", ")}. Please correlate clinically.`;
    };

    const generateInterpretation = () => {
        const hasHighWBC = parameters.find(p => p.parameter === "Total WBC Count" && p.flag === "high");
        const hasLowRBC = parameters.find(p => p.parameter === "Total RBC count" && p.flag === "low");
        const hasLowHB = parameters.find(p => p.parameter === "Hemoglobin(HB)" && p.flag === "low");

        if (hasHighWBC) return "Leukocytosis detected. Suggest clinical correlation for possible infection/inflammation.";
        if (hasLowRBC || hasLowHB) return "Anemic profile detected. Further evaluation recommended.";
        return "Normal CBC profile. No significant abnormalities.";
    };

    const handleGenerate = () => {
        window.print();
    };

    const handleDownload = () => {
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
                text: `Test Report for ${metadata.patientName}`,
                url: window.location.href,
            });
        }
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

    // Group parameters by category for better organization
    const groupedParameters = parameters.reduce((acc, param) => {
        if (!acc[param.category]) {
            acc[param.category] = [];
        }
        acc[param.category].push(param);
        return acc;
    }, {});

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
                            {testData.test_name} - {testData.test_code}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                   
                    <button
                        onClick={handleShare}
                        className="p-2 text-gray-600 bg-white border border-gray-200 
                                 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Share"
                    >
                        <Share2 size={16} />
                    </button>
                    
                </div>
            </div>

            {/* Success Message */}
            

            {/* Preview Mode Notice */}
            

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
                                <Microscope size={28} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{metadata.labName}</h2>
                                <p className="text-sm text-cyan-100 mt-0.5">
                                    {metadata.labAddress}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-sm">
                                <Shield size={14} />
                                <span>{metadata.accreditation}</span>
                            </div>
                            <p className="text-xs text-cyan-100 mt-1">
                                Reg No: {metadata.registrationNo}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Report Meta Info */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 
                              flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar size={12} /> Report Date: {metadata.reportDate}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={12} /> Report Time: {metadata.reportTime}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <QrCode size={16} className="text-gray-400" />
                        <span className="text-xs font-mono text-gray-500">
                            {testData.test_code}-{metadata.patientId.slice(-6)}
                        </span>
                    </div>
                </div>

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
                                    {metadata.patientName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-24">Patient ID:</span>
                                <span className="text-sm text-gray-600">
                                    {metadata.patientId}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-24">Age/Gender:</span>
                                <span className="text-sm text-gray-600">
                                    {metadata.ageGender}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-24">Mobile:</span>
                                <span className="text-sm text-gray-600">
                                    {metadata.mobile}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-24">Email:</span>
                                <span className="text-sm text-gray-600">
                                    {metadata.email}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-24">Sample ID:</span>
                                <span className="text-sm font-mono text-gray-600">
                                    {metadata.sampleId}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referral Doctor */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Stethoscope size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-500">Referral Doctor:</span>
                            <span className="text-sm font-medium text-gray-800">
                                {metadata.referralDoctor}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500">
                            Reg No: {metadata.doctorRegNo}
                        </span>
                    </div>
                </div>

                {/* Test Results */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-800 
                                     flex items-center gap-2">
                            <Flask size={16} className="text-cyan-600" />
                            Test Results - {testData.test_name}
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="text-xs bg-gray-100 text-gray-600 
                                           px-2 py-1 rounded-full">
                                {testData.test_code}
                            </span>
                            <span className="text-xs bg-cyan-100 text-cyan-700 
                                           px-2 py-1 rounded-full">
                                {metadata.sampleType}
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
                                {parameters.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
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
                                {generateComments()}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 
                                         uppercase tracking-wider mb-2">
                                Interpretation
                            </h4>
                            <p className="text-sm text-gray-700 bg-gray-50 
                                       p-3 rounded-lg">
                                {generateInterpretation()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Equipment & Pathologist Info */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm">
                        <div>
                            <span className="text-xs text-gray-500">Equipment Used:</span>
                            <p className="font-medium text-gray-700">{metadata.equipmentUsed}</p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500">Pathologist:</span>
                            <p className="font-medium text-gray-700">
                                {metadata.pathologist.name} ({metadata.pathologist.qualification})
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500">Reviewed By:</span>
                            <p className="font-medium text-gray-700">{metadata.reviewedBy}</p>
                        </div>
                    </div>
                </div>

                {/* Signatures */}
                <div className="p-6">
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400">
                                    This is a computer generated report. Valid without signature.
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Report generated by: TECH-123 • Lab Technician
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="w-32 h-12 border-b border-gray-300 
                                              flex items-center justify-end">
                                    <span className="text-xs text-gray-400 font-handwriting">
                                        Dr. Sarah Johnson
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Pathologist Signature
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <p>© 2026 {metadata.labName}. All rights reserved.</p>
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
                .font-handwriting {
                    font-family: 'Brush Script MT', cursive;
                }
            `}</style>
        </div>
    );
};

export default GenerateReport;