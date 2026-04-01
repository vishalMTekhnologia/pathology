// src/components/ReportViewer.jsx
import React, { useRef } from "react";
import { Printer, Download, X } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ReportViewer = ({ report, onClose }) => {
    const reportRef = useRef();

    // Format date from timestamp
    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // Get sex label
    const getSexLabel = (sex) => {
        if (sex === "1") return "Male";
        if (sex === "2") return "Female";
        if (sex === "3") return "Other";
        return "N/A";
    };

    // Determine flag status
    const getFlagStatus = (value, min, max) => {
        if (value === null || value === undefined || value === "") return null;
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return null;
        if (min && numValue < min) return "Low";
        if (max && numValue > max) return "High";
        return "Normal";
    };

    // Format value with flag indicator
    const formatValueWithFlag = (value, flag, min, max) => {
        if (!value) return "—";
        if (flag === "Low") return `${value} ↓`;
        if (flag === "High") return `${value} ↑`;
        return value;
    };

    // Print report
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${report?.patient_name}_${report?.test_name}_Report</title>
                <style>
                    @media print {
                        body {
                            margin: 0;
                            padding: 20px;
                        }
                        .no-print {
                            display: none;
                        }
                        table {
                            page-break-inside: avoid;
                        }
                        tr {
                            page-break-inside: avoid;
                        }
                    }
                    body {
                        font-family: 'Arial', 'Helvetica', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: white;
                    }
                    .report-container {
                        max-width: 1000px;
                        margin: 0 auto;
                        font-size: 12px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 25px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #4c1d95;
                    }
                    .lab-name {
                        font-size: 24px;
                        font-weight: bold;
                        color: #4c1d95;
                        margin: 0;
                    }
                    .tagline {
                        font-size: 11px;
                        color: #666;
                        margin: 5px 0;
                    }
                    .address {
                        font-size: 10px;
                        color: #999;
                        margin: 5px 0;
                    }
                    .patient-card {
                        background: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        padding: 15px;
                        margin: 20px 0;
                    }
                    .patient-info {
                        display: flex;
                        justify-content: space-between;
                        flex-wrap: wrap;
                    }
                    .patient-name {
                        font-size: 16px;
                        font-weight: bold;
                        color: #1f2937;
                        margin-bottom: 8px;
                    }
                    .patient-details {
                        color: #4b5563;
                        font-size: 12px;
                    }
                    .sample-info {
                        text-align: right;
                        font-size: 10px;
                        color: #6b7280;
                    }
                    .test-title {
                        font-size: 16px;
                        font-weight: bold;
                        color: #1f2937;
                        margin: 20px 0 10px 0;
                        padding-bottom: 5px;
                        border-bottom: 2px solid #e5e7eb;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 15px 0;
                    }
                    th, td {
                        border: 1px solid #e5e7eb;
                        padding: 10px 12px;
                        text-align: left;
                        vertical-align: top;
                    }
                    th {
                        background-color: #f9fafb;
                        font-weight: 600;
                        font-size: 11px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        color: #4b5563;
                    }
                    .category-header {
                        background-color: #f3f4f6;
                        font-weight: bold;
                        font-size: 13px;
                    }
                    .result-low {
                        color: #f97316;
                        font-weight: 600;
                    }
                    .result-high {
                        color: #ef4444;
                        font-weight: 600;
                    }
                    .result-normal {
                        color: #10b981;
                    }
                    .instrument-info {
                        text-align: right;
                        font-size: 9px;
                        color: #9ca3af;
                        margin-top: 20px;
                        padding-top: 10px;
                        border-top: 1px solid #e5e7eb;
                    }
                    .interpretation {
                        margin: 20px 0;
                        padding: 12px;
                        background: #fef3c7;
                        border-left: 4px solid #f59e0b;
                        font-size: 11px;
                        color: #92400e;
                    }
                    .footer {
                        text-align: center;
                        font-size: 9px;
                        color: #9ca3af;
                        margin-top: 30px;
                        padding-top: 10px;
                        border-top: 1px solid #e5e7eb;
                    }
                </style>
            </head>
            <body>
                <div class="report-container">
                    ${document.getElementById('report-content').innerHTML}
                </div>
                <script>
                    window.onload = () => {
                        window.print();
                        setTimeout(() => window.close(), 500);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Download as PDF
    const handleDownloadPDF = async () => {
        const element = document.getElementById('report-content');
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const pageHeight = 277;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        pdf.save(`${report.patient_name}_${report.test_name}_Report.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">

                {/* Print Controls */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-end gap-3 z-10 no-print">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 
                                 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        <X size={16} />
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-semibold
                                 hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/30
                                 flex items-center gap-2"
                    >
                        <Printer size={16} />
                        Print Report
                    </button>
                </div>

                {/* Report Content - This will be printed */}
                <div id="report-content" ref={reportRef} className="p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-cyan-800">DRLOGY PATHOLOGY LAB</h1>
                        <p className="text-xs text-gray-500 mt-1">Accurate | Caring | Instant</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                            105-108, SMART VISION COMPLEX, HEALTHCARE ROAD, OPPOSITE HEALTHCARE COMPLEX. MUMBAI - 680578
                        </p>
                    </div>

                    {/* Patient Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                        <div className="flex justify-between items-start flex-wrap gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{report?.patient_name}</h2>
                                <div className="flex gap-4 mt-1 text-sm text-gray-600">
                                    <span><strong>Age:</strong> {report?.age} Years</span>
                                    <span><strong>Sex:</strong> {getSexLabel(report?.sex)}</span>
                                    <span><strong>PID:</strong> {report?.report_id}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">
                                    <strong>Sample Collected At:</strong><br />
                                    125, Shivam Bungalow, S G Road, Mumbai
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    <strong>Ref. By:</strong> Dr. Hiren Shah
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    <strong>Report Date:</strong> {formatDate(report?.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Test Results */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">{report?.test_name}</h3>

                        {report?.categories?.map(cat => (
                            cat.sub_categories && cat.sub_categories.length > 0 && (
                                <div key={cat.category_id} className="mb-6">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold text-gray-600">
                                                    Investigation
                                                </th>
                                                <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold text-gray-600">
                                                    Result
                                                </th>
                                                <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold text-gray-600">
                                                    Reference Value
                                                </th>
                                                <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold text-gray-600">
                                                    Unit
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Category Header */}
                                            <tr className="bg-gray-50">
                                                <td colSpan="4" className="border border-gray-300 px-4 py-2 font-bold text-sm">
                                                    {cat.category_name}
                                                </td>
                                            </tr>

                                            {/* Sub-category rows */}
                                            {cat.sub_categories.map(sub => {
                                                const flag = getFlagStatus(sub.value, sub.normal_range_min, sub.normal_range_max);
                                                const valueDisplay = formatValueWithFlag(sub.value_text || sub.value, flag, sub.normal_range_min, sub.normal_range_max);
                                                const flagClass = flag === "Low" ? "text-orange-600 font-semibold" :
                                                    flag === "High" ? "text-red-600 font-semibold" : "";

                                                return (
                                                    <tr key={sub.sub_category_id}>
                                                        <td className="border border-gray-300 px-4 py-2 text-sm">
                                                            {sub.sub_category_name}
                                                        </td>
                                                        <td className={`border border-gray-300 px-4 py-2 text-sm ${flagClass}`}>
                                                            {valueDisplay}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2 text-sm">
                                                            {sub.normal_range_min !== undefined && sub.normal_range_max !== undefined ? (
                                                                <>
                                                                    {sub.normal_range_min} - {sub.normal_range_max}
                                                                    {flag && flag !== "Normal" && (
                                                                        <span className={`ml-2 text-xs ${flag === "Low" ? "text-orange-600" : "text-red-600"}`}>
                                                                            ({flag})
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                "—"
                                                            )}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2 text-sm">
                                                            {sub.unit || "—"}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        ))}
                    </div>

                    {/* Instrument Info */}
                    <div className="text-right text-[10px] text-gray-400 mt-4 pt-2 border-t border-gray-200">
                        <p>Instruments: Fully automated cell counter - Mindray 300</p>
                    </div>

                    {/* Interpretation (if any) */}
                    {report?.interpretation && (
                        <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-500 text-sm text-amber-800">
                            <strong>Interpretation:</strong> {report.interpretation}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center text-[10px] text-gray-400 mt-6 pt-3 border-t border-gray-200">
                        <p>Thanks for Reference</p>
                        <p className="mt-1">**** End of Report ****</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportViewer;