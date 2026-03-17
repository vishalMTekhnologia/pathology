// PASTE YOUR TestManagement.jsx CODE HERE FROM THE CODE YOU SAVED IN NOTEPAD
// src/pages/AdminPages/TestManagement.jsx
import { useState } from "react";
import {
    Plus, Pencil, Trash2, X, Search, Filter,
    ChevronLeft, ChevronRight, Download, Tag,
    Beaker, FlaskConical, DollarSign, Layers
} from "lucide-react";

const PRIMARY = "#0891b2";
const TABS = ["Categories", "Tests", "Test Parameters", "Pricing"];

// ── Initial Data ──────────────────────────────────────────────
const initCategories = [
    { id: 1, name: "Haematology", description: "Blood related tests", testsCount: 12 },
    { id: 2, name: "Biochemistry", description: "Chemical analysis of blood/urine", testsCount: 18 },
    { id: 3, name: "Microbiology", description: "Infection and culture tests", testsCount: 9 },
    { id: 4, name: "Endocrinology", description: "Hormone level tests", testsCount: 7 },
];

const initTests = [
    { id: 1, name: "Complete Blood Count (CBC)", category: "Haematology", duration: "4 hrs", status: "Available" },
    { id: 2, name: "Blood Glucose Fasting", category: "Biochemistry", duration: "2 hrs", status: "Available" },
    { id: 3, name: "Lipid Profile", category: "Biochemistry", duration: "6 hrs", status: "Available" },
    { id: 4, name: "Urine Routine", category: "Microbiology", duration: "2 hrs", status: "Available" },
    { id: 5, name: "Thyroid Profile (T3,T4,TSH)", category: "Endocrinology", duration: "8 hrs", status: "Unavailable" },
    { id: 6, name: "Liver Function Test (LFT)", category: "Biochemistry", duration: "6 hrs", status: "Available" },
];

const initParameters = [
    { id: 1, test: "Complete Blood Count (CBC)", parameterName: "WBC", unit: "cells/mcL", normalRange: "4,500-11,000" },
    { id: 2, test: "Complete Blood Count (CBC)", parameterName: "RBC", unit: "million cells/mcL", normalRange: "4.5-5.9" },
    { id: 3, test: "Complete Blood Count (CBC)", parameterName: "Hemoglobin", unit: "g/dL", normalRange: "13.5-17.5" },
    { id: 4, test: "Lipid Profile", parameterName: "Total Cholesterol", unit: "mg/dL", normalRange: "<200" },
    { id: 5, test: "Lipid Profile", parameterName: "HDL", unit: "mg/dL", normalRange: ">40" },
    { id: 6, test: "Thyroid Profile (T3,T4,TSH)", parameterName: "TSH", unit: "mIU/L", normalRange: "0.4-4.0" },
];

const initPricing = [
    { id: 1, test: "Complete Blood Count (CBC)", category: "Haematology", price: 350, discountedPrice: 299, tax: 18 },
    { id: 2, test: "Blood Glucose Fasting", category: "Biochemistry", price: 120, discountedPrice: 99, tax: 18 },
    { id: 3, test: "Lipid Profile", category: "Biochemistry", price: 600, discountedPrice: 499, tax: 18 },
    { id: 4, test: "Urine Routine", category: "Microbiology", price: 150, discountedPrice: 120, tax: 5 },
    { id: 5, test: "Thyroid Profile (T3,T4,TSH)", category: "Endocrinology", price: 850, discountedPrice: 749, tax: 18 },
    { id: 6, test: "Liver Function Test (LFT)", category: "Biochemistry", price: 700, discountedPrice: 599, tax: 18 },
];

// Tab Icons
const tabIcons = {
    "Categories": <Layers size={18} />,
    "Tests": <Beaker size={18} />,
    "Test Parameters": <FlaskConical size={18} />,
    "Pricing": <DollarSign size={18} />,
};

const TestManagement = () => {
    const [activeTab, setActiveTab] = useState("Categories");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Data states
    const [categories, setCategories] = useState(initCategories);
    const [tests, setTests] = useState(initTests);
    const [parameters, setParameters] = useState(initParameters);
    const [pricing, setPricing] = useState(initPricing);

    // Modal state
    const [modal, setModal] = useState(null); // { type, item }
    const [form, setForm] = useState({});

    const openAdd = () => {
        setForm({});
        setModal({ type: "add" });
    };
    const openEdit = (item) => {
        setForm({ ...item });
        setModal({ type: "edit", item });
    };
    const closeModal = () => setModal(null);

    const handleDelete = (setter, id) => {
        if (window.confirm("Are you sure you want to delete this?")) {
            setter(prev => prev.filter(x => x.id !== id));
        }
    };

    const newId = (list) => list.length ? Math.max(...list.map(x => x.id)) + 1 : 1;

    const handleSave = () => {
        if (activeTab === "Categories") {
            if (!form.name) return alert("Name is required");
            setCategories(prev => modal.type === "edit"
                ? prev.map(x => x.id === modal.item.id ? { ...x, ...form } : x)
                : [...prev, { ...form, id: newId(prev), testsCount: 0 }]);
        }
        if (activeTab === "Tests") {
            if (!form.name || !form.category) return alert("Name and Category are required");
            setTests(prev => modal.type === "edit"
                ? prev.map(x => x.id === modal.item.id ? { ...x, ...form } : x)
                : [...prev, { ...form, id: newId(prev) }]);
        }
        if (activeTab === "Test Parameters") {
            if (!form.test || !form.parameterName) return alert("Test and Parameter Name are required");
            setParameters(prev => modal.type === "edit"
                ? prev.map(x => x.id === modal.item.id ? { ...x, ...form } : x)
                : [...prev, { ...form, id: newId(prev) }]);
        }
        if (activeTab === "Pricing") {
            if (!form.test || !form.price) return alert("Test and Price are required");
            setPricing(prev => modal.type === "edit"
                ? prev.map(x => x.id === modal.item.id ? { ...x, ...form } : x)
                : [...prev, { ...form, id: newId(prev) }]);
        }
        closeModal();
    };

    const testNames = tests.map(t => t.name);
    const categoryNames = categories.map(c => c.name);

    // Get current data based on active tab
    const getCurrentData = () => {
        switch (activeTab) {
            case "Categories": return categories;
            case "Tests": return tests;
            case "Test Parameters": return parameters;
            case "Pricing": return pricing;
            default: return [];
        }
    };

    const currentData = getCurrentData();

    // Filter based on search
    const filteredData = currentData.filter(item => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        if (activeTab === "Categories") {
            return item.name?.toLowerCase().includes(searchLower) ||
                item.description?.toLowerCase().includes(searchLower);
        }
        if (activeTab === "Tests") {
            return item.name?.toLowerCase().includes(searchLower) ||
                item.category?.toLowerCase().includes(searchLower);
        }
        if (activeTab === "Test Parameters") {
            return item.parameterName?.toLowerCase().includes(searchLower) ||
                item.test?.toLowerCase().includes(searchLower);
        }
        if (activeTab === "Pricing") {
            return item.test?.toLowerCase().includes(searchLower) ||
                item.category?.toLowerCase().includes(searchLower);
        }
        return true;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const tabCounts = {
        "Categories": categories.length,
        "Tests": tests.length,
        "Test Parameters": parameters.length,
        "Pricing": pricing.length,
    };

    return (
        <div className="font-sans space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Test Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage categories, tests, parameters, and pricing</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 
                                     rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download size={16} />
                        Export
                    </button>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-cyan-600 text-white px-5 py-2.5 rounded-lg 
                                 text-sm font-semibold hover:bg-cyan-700 active:bg-cyan-800 
                                 transform hover:-translate-y-0.5 transition-all duration-200
                                 shadow-lg shadow-cyan-600/30"
                    >
                        <Plus size={18} />
                        Add New
                    </button>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Tabs Section */}
                <div className="border-b border-gray-200 bg-gray-50/50">
                    <div className="flex overflow-x-auto scrollbar-hide px-6">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setSearchTerm("");
                                    setCurrentPage(1);
                                }}
                                className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 
                                         transition-all duration-200 flex items-center gap-2
                                         ${activeTab === tab
                                        ? 'border-cyan-600 text-cyan-700'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className={activeTab === tab ? 'text-cyan-600' : 'text-gray-400'}>
                                    {tabIcons[tab]}
                                </span>
                                {tab}
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                    ${activeTab === tab
                                        ? 'bg-cyan-100 text-cyan-700'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {tabCounts[tab]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab.toLowerCase()}...`}
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg 
                                         text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                         transition-all duration-200"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white 
                                             border border-gray-200 rounded-lg hover:bg-gray-50 
                                             transition-colors flex items-center gap-2 flex-1 sm:flex-none
                                             justify-center">
                                <Filter size={16} />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tables */}
                <div className="overflow-x-auto">
                    {/* Categories Table */}
                    {activeTab === "Categories" && (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-y border-gray-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tests Count</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map(cat => (
                                    <tr key={cat.id} className="hover:bg-gray-50/80 transition-colors duration-150 group">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{cat.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{cat.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {cat.testsCount} tests
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(cat)}
                                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(setCategories, cat.id)}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No categories found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* Tests Table */}
                    {activeTab === "Tests" && (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-y border-gray-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map(test => (
                                    <tr key={test.id} className="hover:bg-gray-50/80 transition-colors duration-150 group">
                                        <td className="px-6 py-4 font-medium text-gray-900">{test.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {test.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{test.duration}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                ${test.status === "Available"
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {test.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(test)}
                                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(setTests, test.id)}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No tests found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* Parameters Table */}
                    {activeTab === "Test Parameters" && (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-y border-gray-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Test</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Parameter Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Normal Range</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map(param => (
                                    <tr key={param.id} className="hover:bg-gray-50/80 transition-colors duration-150 group">
                                        <td className="px-6 py-4 text-gray-600">{param.test}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{param.parameterName}</td>
                                        <td className="px-6 py-4 text-gray-600">{param.unit}</td>
                                        <td className="px-6 py-4 text-gray-700 font-mono">{param.normalRange}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(param)}
                                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(setParameters, param.id)}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No parameters found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* Pricing Table */}
                    {activeTab === "Pricing" && (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-y border-gray-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Test</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (₹)</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Discounted (₹)</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax %</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map(price => (
                                    <tr key={price.id} className="hover:bg-gray-50/80 transition-colors duration-150 group">
                                        <td className="px-6 py-4 font-medium text-gray-900">{price.test}</td>
                                        <td className="px-6 py-4 text-gray-600">{price.category}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">₹{price.price}</td>
                                        <td className="px-6 py-4 font-semibold text-green-600">₹{price.discountedPrice}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {price.tax}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(price)}
                                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(setPricing, price.id)}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No pricing found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {filteredData.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 
                                  flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 
                                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                                         transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                        ${currentPage === i + 1
                                            ? 'bg-cyan-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 
                                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                                         transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── MODALS ── */}
            {modal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto
                                  shadow-2xl transform animate-in slide-in-from-bottom-4 duration-300">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 
                                      flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {modal.type === "edit" ? `Edit ${activeTab.slice(0, -1)}` : `Add ${activeTab.slice(0, -1)}`}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {modal.type === "edit" ? "Update details" : `Add new ${activeTab.toLowerCase().slice(0, -1)}`}
                                </p>
                            </div>
                            <button onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {activeTab === "Categories" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Category Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={form.name || ""}
                                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                            placeholder="e.g. Haematology"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Description
                                        </label>
                                        <input
                                            value={form.description || ""}
                                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                            placeholder="Brief description"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200"
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === "Tests" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Test Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={form.name || ""}
                                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                            placeholder="e.g. Complete Blood Count"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.category || ""}
                                            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200 cursor-pointer"
                                        >
                                            <option value="">Select category</option>
                                            {categoryNames.map(cat => <option key={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Duration
                                        </label>
                                        <input
                                            value={form.duration || ""}
                                            onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                                            placeholder="e.g. 4 hrs"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Status
                                        </label>
                                        <select
                                            value={form.status || ""}
                                            onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200 cursor-pointer"
                                        >
                                            <option value="">Select status</option>
                                            <option>Available</option>
                                            <option>Unavailable</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {activeTab === "Test Parameters" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Test <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.test || ""}
                                            onChange={e => setForm(p => ({ ...p, test: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200 cursor-pointer"
                                        >
                                            <option value="">Select test</option>
                                            {testNames.map(test => <option key={test}>{test}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Parameter Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={form.parameterName || ""}
                                            onChange={e => setForm(p => ({ ...p, parameterName: e.target.value }))}
                                            placeholder="e.g. WBC, RBC, Hemoglobin"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Unit
                                        </label>
                                        <input
                                            value={form.unit || ""}
                                            onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                                            placeholder="e.g. g/dL, mg/dL"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Normal Range
                                        </label>
                                        <input
                                            value={form.normalRange || ""}
                                            onChange={e => setForm(p => ({ ...p, normalRange: e.target.value }))}
                                            placeholder="e.g. 4.5-5.9"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200"
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === "Pricing" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Test <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.test || ""}
                                            onChange={e => setForm(p => ({ ...p, test: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200 cursor-pointer"
                                        >
                                            <option value="">Select test</option>
                                            {testNames.map(test => <option key={test}>{test}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Category
                                        </label>
                                        <select
                                            value={form.category || ""}
                                            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200 cursor-pointer"
                                        >
                                            <option value="">Select category</option>
                                            {categoryNames.map(cat => <option key={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Price (₹) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={form.price || ""}
                                            onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                                            placeholder="e.g. 500"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Discounted Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            value={form.discountedPrice || ""}
                                            onChange={e => setForm(p => ({ ...p, discountedPrice: e.target.value }))}
                                            placeholder="e.g. 399"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Tax (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={form.tax || ""}
                                            onChange={e => setForm(p => ({ ...p, tax: e.target.value }))}
                                            placeholder="e.g. 18"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                                     transition-all duration-200"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 
                                      flex justify-end gap-3">
                            <button onClick={closeModal}
                                className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium
                                         text-gray-700 hover:bg-gray-100 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave}
                                className="px-5 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium
                                         hover:bg-cyan-700 active:bg-cyan-800 transition-all
                                         shadow-lg shadow-cyan-600/30">
                                {modal.type === "edit" ? "Save Changes" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestManagement;