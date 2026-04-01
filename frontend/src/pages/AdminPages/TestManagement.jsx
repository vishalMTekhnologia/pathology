// src/pages/AdminPages/TestManagement.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Plus, Pencil, Trash2, X, Search, Filter,
    ChevronLeft, ChevronRight, Download,
    Beaker, Layers, FlaskConical, Loader2
} from "lucide-react";

import { fetchTests, addTest, updateTest, deleteTest, resetTestState } from "../../features/admin/TestSlice";
import { fetchCategories, addCategory, updateCategory, deleteCategory, resetCategoryState } from "../../features/admin/CategorySlice";
import { fetchSubCategories, addSubCategory, updateSubCategory, deleteSubCategory, resetSubCategoryState } from "../../features/admin/SubCategorySlice";

const TABS = ["Tests", "Categories", "Subcategories"];

const tabIcons = {
    Tests: <Beaker size={18} />,
    Categories: <Layers size={18} />,
    Subcategories: <FlaskConical size={18} />,
};

const TestManagement = () => {
    const dispatch = useDispatch();

    // ── Redux selectors ───────────────────────────────────────────────────────
    const {
        tests: apiTests,
        loading: testsLoading,
        actionLoading: testActionLoading,
        actionError: testActionError,
    } = useSelector(state => state.tests);

    const {
        categories: apiCategories,
        loading: categoriesLoading,
        actionLoading: categoryActionLoading,
        actionError: categoryActionError,
    } = useSelector(state => state.categories);

    const {
        subCategories: apiSubCategories,
        loading: subCategoriesLoading,
        actionLoading: subCategoryActionLoading,
        actionError: subCategoryActionError,
    } = useSelector(state => state.subCategories);

    // ── Local UI state ────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState("Tests");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [modal, setModal] = useState(null); // null | { type: "add" | "edit", item?: object }
    const [form, setForm] = useState({});
    const [formError, setFormError] = useState("");

    // ── Fetch on mount ────────────────────────────────────────────────────────
    useEffect(() => {
        dispatch(fetchTests());
        dispatch(fetchCategories());
        dispatch(fetchSubCategories());
    }, [dispatch]);

    // ── Normalise API data ────────────────────────────────────────────────────
    const tests = (Array.isArray(apiTests) ? apiTests : []).map(t => ({
        id: t.test_id || t.id,
        test_code: t.test_code || "",
        name: t.test_name || t.name || "",
        description: t.test_description || t.description || "",
        status: t.status || "1",
    }));

    const categories = (Array.isArray(apiCategories) ? apiCategories : []).map(c => ({
        id: c.category_id || c.id,
        name: c.category_name || c.name || "",
        description: c.category_discription || c.description || "",
        price: c.price ?? 0,
        test_id: c.test_id,
    }));

    const subCategories = (Array.isArray(apiSubCategories) ? apiSubCategories : []).map(s => ({
        id: s.sub_category_id || s.id,
        category_id: s.category_id,
        name: s.sub_category_name || s.name || "",
        description: s.sub_category_description || s.description || "",
        unit: s.unit || "",
        normal_range_min: s.normal_range_min || "",
        normal_range_max: s.normal_range_max || "",
    }));

    // ── Modal helpers ─────────────────────────────────────────────────────────
    const openAdd = () => {
        setForm({});
        setFormError("");
        setModal({ type: "add" });
        dispatch(resetTestState());
        dispatch(resetCategoryState());
        dispatch(resetSubCategoryState());
    };

    const openEdit = (item) => {
        setForm({ ...item });
        setFormError("");
        setModal({ type: "edit", item });
        dispatch(resetTestState());
        dispatch(resetCategoryState());
        dispatch(resetSubCategoryState());
    };

    const closeModal = () => {
        setModal(null);
        setForm({});
        setFormError("");
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (tab, id) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;
        if (tab === "Tests") {
            await dispatch(deleteTest(id));
            dispatch(fetchTests());
        } else if (tab === "Categories") {
            await dispatch(deleteCategory(id));
            dispatch(fetchCategories());
        } else if (tab === "Subcategories") {
            await dispatch(deleteSubCategory(id));
            dispatch(fetchSubCategories());
        }
    };

    // ── Save (add / edit) ─────────────────────────────────────────────────────
    const handleSave = async () => {
        setFormError("");

        if (activeTab === "Tests") {
            if (!form.name?.trim()) return setFormError("Test Name is required.");
            if (modal.type === "edit") {
                const result = await dispatch(updateTest({
                    id: modal.item.id,
                    test_code: form.test_code || "",
                    test_name: form.name,
                    test_description: form.description || "",
                }));
                if (updateTest.rejected.match(result)) return setFormError(result.payload);
            } else {
                const result = await dispatch(addTest({
                    test_code: form.test_code || "",
                    test_name: form.name,
                    test_description: form.description || "",
                }));
                if (addTest.rejected.match(result)) return setFormError(result.payload);
            }
            dispatch(fetchTests());
            closeModal();
        }

        if (activeTab === "Categories") {
            if (!form.name?.trim()) return setFormError("Category Name is required.");
            if (!form.test_id) return setFormError("Please select a linked test.");

            const payload = {
                test_id: String(form.test_id),
                category_name: form.name,
                category_discription: form.description || "",
                price: Number(form.price) || 0,
            };

            if (modal.type === "edit") {
                const result = await dispatch(updateCategory({ id: modal.item.id, ...payload }));
                if (updateCategory.rejected.match(result)) return setFormError(result.payload);
            } else {
                const result = await dispatch(addCategory(payload));
                if (addCategory.rejected.match(result)) return setFormError(result.payload);
            }
            dispatch(fetchCategories());
            closeModal();
        }

        if (activeTab === "Subcategories") {
            if (!form.name?.trim()) return setFormError("Sub-category Name is required.");
            if (!form.category_id) return setFormError("Please select a linked category.");

            const payload = {
                category_id: String(form.category_id),
                sub_category_name: form.name,
                sub_category_description: form.description || "",
                unit: form.unit || "",
                normal_range_min: String(form.normal_range_min || ""),
                normal_range_max: String(form.normal_range_max || ""),
            };

            if (modal.type === "edit") {
                const result = await dispatch(updateSubCategory({ id: modal.item.id, ...payload }));
                if (updateSubCategory.rejected.match(result)) return setFormError(result.payload);
            } else {
                const result = await dispatch(addSubCategory(payload));
                if (addSubCategory.rejected.match(result)) return setFormError(result.payload);
            }
            dispatch(fetchSubCategories());
            closeModal();
        }
    };

    // ── Table data ────────────────────────────────────────────────────────────
    const getCurrentData = () => {
        switch (activeTab) {
            case "Tests": return tests;
            case "Categories": return categories;
            case "Subcategories": return subCategories;
            default: return [];
        }
    };

    const isLoading =
        (activeTab === "Tests" && testsLoading) ||
        (activeTab === "Categories" && categoriesLoading) ||
        (activeTab === "Subcategories" && subCategoriesLoading);

    const isActionLoading =
        (activeTab === "Tests" && testActionLoading) ||
        (activeTab === "Categories" && categoryActionLoading) ||
        (activeTab === "Subcategories" && subCategoryActionLoading);

    const filteredData = getCurrentData().filter(item => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return Object.values(item).some(v => String(v).toLowerCase().includes(q));
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfFirst = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirst, indexOfFirst + itemsPerPage);

    const tabCounts = {
        Tests: tests.length,
        Categories: categories.length,
        Subcategories: subCategories.length,
    };

    // Helper: find test name by id
    const testNameById = (id) => tests.find(t => t.id === Number(id))?.name || id;
    // Helper: find category name by id
    const categoryNameById = (id) => categories.find(c => c.id === Number(id))?.name || id;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="font-sans space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Test Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage tests, categories, and sub-categories</p>
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

                {/* Tabs */}
                <div className="border-b border-gray-200 bg-gray-50/50">
                    <div className="flex overflow-x-auto scrollbar-hide px-6">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setSearchTerm(""); setCurrentPage(1); }}
                                className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2
                                         transition-all duration-200 flex items-center gap-2
                                         ${activeTab === tab
                                        ? "border-cyan-600 text-cyan-700"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <span className={activeTab === tab ? "text-cyan-600" : "text-gray-400"}>
                                    {tabIcons[tab]}
                                </span>
                                {tab}
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                    ${activeTab === tab
                                        ? "bg-cyan-100 text-cyan-700"
                                        : "bg-gray-200 text-gray-600"
                                    }`}>
                                    {tabCounts[tab]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab.toLowerCase()}...`}
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg
                                         text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200
                                         transition-all duration-200"
                            />
                        </div>
                        <button className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white
                                         border border-gray-200 rounded-lg hover:bg-gray-50
                                         transition-colors flex items-center gap-2">
                            <Filter size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin text-cyan-600" size={32} />
                        <span className="ml-3 text-gray-500">Loading {activeTab.toLowerCase()}...</span>
                    </div>
                )}

                {/* Tables */}
                {!isLoading && (
                    <div className="overflow-x-auto">

                        {/* ── Tests Table ── */}
                        {activeTab === "Tests" && (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-y border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Code</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentItems.map(test => (
                                        <tr key={test.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {test.test_code || "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{test.name}</td>
                                            <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{test.description || "—"}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2  transition-opacity">
                                                    <button onClick={() => openEdit(test)}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete("Tests", test.id)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {currentItems.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                                                No tests found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* ── Categories Table ── */}
                        {activeTab === "Categories" && (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-y border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Linked Test</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentItems.map(cat => (
                                        <tr key={cat.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4 font-semibold text-gray-900">{cat.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{testNameById(cat.test_id)}</td>
                                            <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{cat.description || "—"}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    ₹{cat.price}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2  transition-opacity">
                                                    <button onClick={() => openEdit(cat)}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete("Categories", cat.id)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {currentItems.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                                                No categories found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* ── Subcategories Table ── */}
                        {activeTab === "Subcategories" && (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-y border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Linked Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Normal Range</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentItems.map(sub => (
                                        <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-gray-900">{sub.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{categoryNameById(sub.category_id)}</td>
                                            <td className="px-6 py-4 text-gray-600">{sub.unit || "—"}</td>
                                            <td className="px-6 py-4 font-mono text-gray-700">
                                                {sub.normal_range_min && sub.normal_range_max
                                                    ? `${sub.normal_range_min} – ${sub.normal_range_max}`
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openEdit(sub)}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete("Subcategories", sub.id)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {currentItems.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                                                No sub-categories found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && filteredData.length > itemsPerPage && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50
                                  flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Showing {indexOfFirst + 1}–{Math.min(indexOfFirst + itemsPerPage, filteredData.length)} of {filteredData.length} entries
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
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                        ${currentPage === i + 1
                                            ? "bg-cyan-600 text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
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

            {/* ── MODAL ── */}
            {modal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5
                                      flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {modal.type === "edit" ? `Edit ${activeTab.slice(0, -1)}` : `Add ${activeTab.slice(0, -1)}`}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {modal.type === "edit" ? "Update the details below" : `Fill in the details for the new ${activeTab.slice(0, -1).toLowerCase()}`}
                                </p>
                            </div>
                            <button onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* ── TESTS form ── */}
                            {activeTab === "Tests" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Test Code
                                        </label>
                                        <input
                                            value={form.test_code || ""}
                                            onChange={e => setForm(p => ({ ...p, test_code: e.target.value }))}
                                            placeholder="e.g. A1, B2"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Test Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={form.name || ""}
                                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                            placeholder="e.g. CBC Test"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Description
                                        </label>
                                        <textarea
                                            value={form.description || ""}
                                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                            placeholder="Brief description"
                                            rows={3}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all resize-none"
                                        />
                                    </div>
                                </>
                            )}

                            {/* ── CATEGORIES form ── */}
                            {activeTab === "Categories" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Category Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={form.name || ""}
                                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                            placeholder="e.g. PLATELET COUNT"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Linked Test <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.test_id || ""}
                                            onChange={e => setForm(p => ({ ...p, test_id: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all cursor-pointer"
                                        >
                                            <option value="">Select a test</option>
                                            {tests.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
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
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.price || ""}
                                            onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                                            placeholder="e.g. 200"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                                        />
                                    </div>
                                </>
                            )}

                            {/* ── SUBCATEGORIES form ── */}
                            {activeTab === "Subcategories" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Sub-Category Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={form.name || ""}
                                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                            placeholder="e.g. Hemoglobin (HB)"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Linked Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.category_id || ""}
                                            onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all cursor-pointer"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
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
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
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
                                                     focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Normal Range Min
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={form.normal_range_min || ""}
                                                onChange={e => setForm(p => ({ ...p, normal_range_min: e.target.value }))}
                                                placeholder="e.g. 13.00"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                         focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Normal Range Max
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={form.normal_range_max || ""}
                                                onChange={e => setForm(p => ({ ...p, normal_range_max: e.target.value }))}
                                                placeholder="e.g. 17.00"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                         focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Inline error */}
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                                    {formError}
                                </div>
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
                            <button
                                onClick={handleSave}
                                disabled={isActionLoading}
                                className="px-5 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium
                                         hover:bg-cyan-700 active:bg-cyan-800 transition-all
                                         shadow-lg shadow-cyan-600/30 disabled:opacity-50
                                         disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isActionLoading && <Loader2 className="animate-spin" size={14} />}
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