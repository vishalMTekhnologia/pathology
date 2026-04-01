// src/pages/AdminPages/Reports.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Search, Download, Loader2, FileText, ChevronLeft, ChevronRight,
    Calendar, User, Stethoscope, Printer, Eye, X, ChevronDown, ChevronUp
} from "lucide-react";
import { fetchReports } from "../../features/admin/ReportSlice";

const Reports = () => {
    const dispatch = useDispatch();
    const { reports, loading, error } = useSelector(state => state.reports);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const itemsPerPage = 5;

    // Get unique test names for filter
    const [selectedTest, setSelectedTest] = useState("");

    useEffect(() => {
        dispatch(fetchReports());
    }, [dispatch]);

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

    // Determine flag status color
    const getFlagColor = (flag) => {
        if (!flag) return "text-gray-600";
        if (flag === "Normal") return "text-green-600";
        if (flag === "Low") return "text-orange-600";
        if (flag === "High") return "text-red-600";
        return "text-gray-600";
    };

    // Get flag badge
    const getFlagBadge = (flag) => {
        if (!flag) return null;
        const colors = {
            Normal: "bg-green-100 text-green-700",
            Low: "bg-orange-100 text-orange-700",
            High: "bg-red-100 text-red-700"
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[flag] || "bg-gray-100 text-gray-700"}`}>
                {flag}
            </span>
        );
    };

    // Filter reports
    const filteredReports = reports.filter(report => {
        const matchesSearch =
            report.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.report_number?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTest = selectedTest ? report.test_name === selectedTest : true;
        return matchesSearch && matchesTest;
    });

    // Get unique test names for filter
    const testNames = [...new Set(reports.map(r => r.test_name).filter(Boolean))];

    // Pagination
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
    const indexOfFirst = (currentPage - 1) * itemsPerPage;
    const currentReports = filteredReports.slice(indexOfFirst, indexOfFirst + itemsPerPage);

    // View report details
    const viewReport = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    // Print report
    const printReport = () => {
        window.print();
    };

    // Download report
    const downloadReport = () => {
        // Implement PDF download functionality
        alert("Download functionality coming soon!");
    };

    return (
        <div className="font-sans space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patient Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">View and manage all patient test reports</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={downloadReport}
                        className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200
                                 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download size={16} />
                        Export All
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{reports.length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Unique Tests</p>
                    <p className="text-2xl font-bold text-cyan-600 mt-1">{testNames.length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Patients</p>
                    <p className="text-2xl font-bold text-cyan-600 mt-1">
                        {[...new Set(reports.map(r => r.patient_name))].length}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Latest Report</p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                        {reports[0] ? formatDate(reports[0].created_at) : "N/A"}
                    </p>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Search and Filter */}
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by patient name or report number..."
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg
                                         text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200
                                         transition-all duration-200"
                            />
                        </div>
                        <select
                            value={selectedTest}
                            onChange={e => { setSelectedTest(e.target.value); setCurrentPage(1); }}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                        >
                            <option value="">All Tests</option>
                            {testNames.map(test => (
                                <option key={test} value={test}>{test}</option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 font-medium">
                            {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin text-cyan-600" size={32} />
                        <span className="ml-3 text-gray-500">Loading reports...</span>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="p-6 text-center">
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    </div>
                )}

                {/* Reports Table */}
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-y border-gray-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Report #</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Parameters</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentReports.map(report => (
                                    <tr key={report.report_id} className="hover:bg-gray-50/80 transition-colors duration-150 group">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                                {report.report_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{report.patient_name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {report.age} yrs, {getSexLabel(report.sex)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-semibold">
                                                {report.test_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} className="text-gray-400" />
                                                {formatDate(report.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {report.categories?.flatMap(cat =>
                                                    cat.sub_categories?.map(sub => (
                                                        sub.value && (
                                                            <span key={sub.sub_category_id} className="text-xs text-gray-500">
                                                                {sub.sub_category_name}: {sub.value_text}
                                                            </span>
                                                        )
                                                    ))
                                                ).filter(Boolean).slice(0, 3)}
                                                {(report.categories?.flatMap(cat => cat.sub_categories?.filter(sub => sub.value)).length || 0) > 3 && (
                                                    <span className="text-xs text-gray-400">+more</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => viewReport(report)}
                                                className="p-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors"
                                                title="View Report"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {currentReports.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center text-gray-400">
                                            No reports found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredReports.length > itemsPerPage && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50
                                  flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Showing {indexOfFirst + 1}–{Math.min(indexOfFirst + itemsPerPage, filteredReports.length)} of {filteredReports.length} entries
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600
                                         hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                        ${currentPage === i + 1 ? "bg-cyan-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600
                                         hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Report Detail Modal */}
            {showModal && selectedReport && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">

                        {/* Header - Lab Info */}
                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100 px-8 py-6">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-cyan-800 tracking-tight">DRLOGY PATHOLOGY LAB</h1>
                                <p className="text-xs text-gray-500 mt-1 font-medium">Accurate | Caring | Instant</p>
                                <p className="text-[11px] text-gray-400 mt-1">
                                    105-108, SMART VISION COMPLEX, HEALTHCARE ROAD, OPPOSITE HEALTHCARE COMPLEX. MUMBAI - 680578
                                </p>
                            </div>

                            {/* Patient Info Card */}
                            <div className="mt-5 bg-white rounded-xl p-4 border border-cyan-100 shadow-sm">
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{selectedReport.patient_name}</h3>
                                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                                            <span><span className="font-semibold">Age:</span> {selectedReport.age} Years</span>
                                            <span>|</span>
                                            <span><span className="font-semibold">Sex:</span> {getSexLabel(selectedReport.sex)}</span>
                                            <span>|</span>
                                            <span><span className="font-semibold">Report #:</span> {selectedReport.report_number}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            <span className="font-semibold">Report Date:</span><br />
                                            {formatDate(selectedReport.created_at)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            <span className="font-semibold">Test:</span> {selectedReport.test_name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Test Results */}
                            <div className="space-y-5">
                                <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
                                    <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                        <FileText size={18} className="text-cyan-600" />
                                        Test Results: {selectedReport.test_name}
                                    </h3>
                                   
                                </div>

                                {selectedReport.categories?.map(cat => (
                                    cat.sub_categories && cat.sub_categories.length > 0 && (
                                        <div key={cat.category_id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-gray-800">{cat.category_name}</span>
                                                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                                            {cat.sub_categories.length} Parameters
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-white border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                Parameter
                                                            </th>
                                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                Result
                                                            </th>
                                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                Reference Range
                                                            </th>
                                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                Flag
                                                            </th>
                                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                Remarks
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {cat.sub_categories.map(sub => (
                                                            <tr key={sub.sub_category_id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-5 py-3">
                                                                    <p className="text-sm font-medium text-gray-800">{sub.sub_category_name}</p>
                                                                    {sub.unit && (
                                                                        <p className="text-xs text-gray-500 mt-0.5">Unit: {sub.unit}</p>
                                                                    )}
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    <span className={`text-sm font-semibold ${getFlagColor(sub.flag)}`}>
                                                                        {sub.value_text || sub.value || "—"}
                                                                    </span>
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    <div className="text-sm text-gray-700">
                                                                        {sub.normal_range_min !== undefined && sub.normal_range_max !== undefined ? (
                                                                            <>
                                                                                <span className="font-mono">
                                                                                    {sub.normal_range_min} - {sub.normal_range_max}
                                                                                </span>
                                                                                {sub.unit && <span className="text-xs text-gray-500 ml-1">{sub.unit}</span>}
                                                                            </>
                                                                        ) : (
                                                                            <span className="text-gray-400 text-xs">No reference</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    {getFlagBadge(sub.flag)}
                                                                </td>
                                                                <td className="px-5 py-3 text-sm text-gray-500">
                                                                    {sub.remarks || "—"}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )
                                ))}

                                {/* Instrument Info */}
                                <div className="text-right text-[10px] text-gray-400 mt-3 pt-2 border-t border-gray-100">
                                    <p>Instruments: Fully automated cell counter - Mindray 300</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-4 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 
                                         hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                <X size={16} />
                                Close
                            </button>
                            <button
                                onClick={printReport}
                                className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg text-sm font-semibold
                                         hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/30
                                         flex items-center gap-2"
                            >
                                <Printer size={16} />
                                Print Report
                            </button>
                        </div>

                        {/* End of Report Footer */}
                        <div className="text-center py-3 border-t border-gray-100 text-[10px] text-gray-400">
                            **** End of Report ****
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;