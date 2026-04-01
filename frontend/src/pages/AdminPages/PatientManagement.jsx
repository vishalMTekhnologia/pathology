// src/pages/AdminPages/PatientManagement.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Pencil, Trash2, X, Search,
    ChevronLeft, ChevronRight, Download, Loader2,
    UserPlus, Phone, Mail, Stethoscope, FileText, ChevronDown, ChevronUp
} from "lucide-react";
import {
    fetchPatients, addPatient, updatePatient, deletePatient,
    resetPatientState, fetchTestWithCategory, submitReport, clearTestWithCategory
} from "../../features/admin/PatientSlice";
import { fetchTests } from "../../features/admin/TestSlice";
import { fetchDoctors } from "../../features/admin/GetDoctorsSlice";
import { getProfile } from "../../features/profile/profileSlice";
import { fetchBloodBoys } from "../../features/admin/BloodCollectionSlice"; // Add this

const SEX_OPTIONS = [
    { value: "1", label: "Male" },
    { value: "2", label: "Female" },
    { value: "3", label: "Other" },
];

const STATUS_OPTIONS = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
];

const PatientManagement = () => {
    const dispatch = useDispatch();
    const {
        patients: apiPatients, loading, actionLoading,
        testWithCategory, testCatLoading, reportLoading, reportSuccess, reportError
    } = useSelector(state => state.patients);
    const { tests: apiTests } = useSelector(state => state.tests);
    const { doctors: apiDoctors } = useSelector(state => state.doctorList);
    const { user } = useSelector(state => state.profile);
    const { bloodBoys, loading: bloodBoysLoading } = useSelector(state => state.bloodCollection); // Add this

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [selectedTests, setSelectedTests] = useState([]);
    const [formError, setFormError] = useState("");

    // ── Report state ──────────────────────────────────────────────────────────
    const [reportPatient, setReportPatient] = useState(null);
    const [reportTestId, setReportTestId] = useState("");
    const [reportCollector, setReportCollector] = useState("");
    const [readings, setReadings] = useState({});
    const [collapsedCategories, setCollapsedCategories] = useState({});

    // ── Fetch on mount ────────────────────────────────────────────────────────
    useEffect(() => {
        dispatch(fetchPatients());
        dispatch(fetchTests());
        dispatch(fetchBloodBoys()); // Add this to fetch blood collection boys
        if (!user) dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user?.lab_id) dispatch(fetchDoctors(user.lab_id));
    }, [dispatch, user]);

    // ── When test-with-category loads, initialise readings ────────────────────
    useEffect(() => {
        if (!testWithCategory) return;
        const initial = {};
        (testWithCategory.categories || []).forEach(cat => {
            (cat.sub_categories || []).forEach(sub => {
                initial[sub.sub_category_id] = { value: "", value_text: "", remarks: "" };
            });
        });
        setReadings(initial);
        setCollapsedCategories({});
    }, [testWithCategory]);

    // ── Close report modal on success ─────────────────────────────────────────
    useEffect(() => {
        if (reportSuccess) {
            closeModal();
            dispatch(resetPatientState());
            dispatch(fetchPatients());
        }
    }, [reportSuccess]);

    // ── Normalise API data ────────────────────────────────────────────────────
    const patients = (Array.isArray(apiPatients) ? apiPatients : []).map(p => ({
        id: p.patient_id || p.id,
        name: p.patient_name || "",
        address: p.patient_address || "",
        contact: String(p.patient_contact || ""),
        email: p.patient_email || "",
        sex: String(p.sex || ""),
        age: p.age || "",
        ref_by_id: p.ref_by_id || "",
        test_ids: Array.isArray(p.tests) ? p.tests.map(t => t.test_id) : [],
        tests: Array.isArray(p.tests) ? p.tests : [],
        status: Number(p.status),
        fees: Number(p.fees) || 0,
        advance: Number(p.advance) || 0,
        created_at: p.created_at || "",
    }));

    const testOptions = (Array.isArray(apiTests) ? apiTests : []).map(t => ({
        id: t.test_id || t.id,
        name: t.test_name || t.name || "",
    }));

    const doctorOptions = (Array.isArray(apiDoctors) ? apiDoctors : []).map(d => ({
        id: d.doc_id || d.doctore_id || d.id,
        name: d.doc_name || d.doctore_name || d.name || "",
    }));

    // Format blood collection boys for dropdown
    const bloodBoyOptions = (Array.isArray(bloodBoys) ? bloodBoys : []).map(b => ({
        id: b.lab_user_id || b.id,
        name: b.full_name || `Collection Boy ${b.lab_user_id}`,
        email: b.user_email,
        contact: b.contact_no,
    }));

    // ── Modal helpers ─────────────────────────────────────────────────────────
    const openAdd = () => {
        setForm({});
        setSelectedTests([]);
        setFormError("");
        setModal({ type: "add" });
        dispatch(resetPatientState());
    };

    const openEdit = (item) => {
        setForm({ ...item });
        setSelectedTests(item.test_ids || []);
        setFormError("");
        setModal({ type: "edit", item });
        dispatch(resetPatientState());
    };

    const openReport = (patient) => {
        setReportPatient(patient);
        setFormError("");
        setReadings({});
        setCollapsedCategories({});

        // Reset test with category state
        dispatch(clearTestWithCategory());

        // If patient has tests, pre-select the first test
        if (patient.tests && patient.tests.length > 0) {
            const firstTest = patient.tests[0];
            setReportTestId(firstTest.test_id);
            // Fetch the test structure immediately
            dispatch(fetchTestWithCategory(firstTest.test_id));
        } else {
            setReportTestId("");
        }

        setReportCollector("");
        setModal({ type: "report" });
    };

    const closeModal = () => {
        setModal(null);
        setForm({});
        setFormError("");
        setReportPatient(null);
        setReportTestId("");
        setReportCollector("");
        setReadings({});
        setCollapsedCategories({});
        dispatch(clearTestWithCategory());
    };

    // ── When test selected in report modal — fetch its structure ──────────────
    const handleReportTestChange = (testId) => {
        setReportTestId(testId);
        setReadings({});
        setCollapsedCategories({});
        if (testId) {
            dispatch(fetchTestWithCategory(testId));
        } else {
            dispatch(clearTestWithCategory());
        }
    };

    // ── Toggle category collapse ──────────────────────────────────────────────
    const toggleCategory = (catId) => {
        setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
    };

    // ── Update a single reading field ─────────────────────────────────────────
    const updateReading = (subId, field, value) => {
        setReadings(prev => ({
            ...prev,
            [subId]: { ...prev[subId], [field]: value },
        }));
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this patient?")) return;
        await dispatch(deletePatient(id));
        dispatch(fetchPatients());
    };

    // ── Toggle test checkbox ──────────────────────────────────────────────────
    const toggleTest = (testId) => {
        setSelectedTests(prev =>
            prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
        );
    };

    // ── Save patient (add/edit) ───────────────────────────────────────────────
    const handleSave = async () => {
        setFormError("");
        if (!form.name?.trim()) return setFormError("Patient Name is required.");
        if (!form.contact?.trim()) return setFormError("Contact Number is required.");

        const payload = {
            patient_name: form.name.trim(),
            patient_address: form.address || "",
            patient_contact: String(form.contact).trim(),
            patient_email: form.email || "",
            sex: String(form.sex || "1"),
            ref_by_id: Number(form.ref_by_id) || 1,
            age: Number(form.age) || 0,
            test_ids: selectedTests,
            status: form.status !== undefined && form.status !== "" ? Number(form.status) : 1,
            fees: Number(form.fees) || 0,
            advance: Number(form.advance) || 0,
        };

        let result;
        if (modal.type === "edit") {
            result = await dispatch(updatePatient({ id: modal.item.id, ...payload }));
            if (updatePatient.rejected.match(result)) return setFormError(result.payload);
        } else {
            result = await dispatch(addPatient(payload));
            if (addPatient.rejected.match(result)) return setFormError(result.payload);
        }
        dispatch(fetchPatients());
        closeModal();
    };

    // ── Submit report ─────────────────────────────────────────────────────────
    const handleSubmitReport = async () => {
        setFormError("");
        if (!reportTestId) return setFormError("Please select a test.");
        if (!reportCollector) return setFormError("Please select the sample collector.");

        // Build readings array — only include sub-categories that have a value
        const readingsArr = Object.entries(readings)
            .filter(([, r]) => r.value_text && r.value_text.trim() !== "")
            .map(([subId, r]) => ({
                sub_category_id: Number(subId),
                value: r.value || 0,
                value_text: r.value_text.trim(),
                remarks: r.remarks || "",
            }));

        if (readingsArr.length === 0) {
            return setFormError("Please enter at least one reading value.");
        }

        const payload = {
            patient_id: reportPatient.id,
            test_id: Number(reportTestId),
            sample_collected_by: Number(reportCollector),
            readings: readingsArr,
        };

        const result = await dispatch(submitReport(payload));
        if (submitReport.rejected.match(result)) {
            return setFormError(result.payload || "Failed to submit report");
        }
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const getSexLabel = (val) => SEX_OPTIONS.find(s => s.value === String(val))?.label || "–";

    // ── Filter + Paginate ─────────────────────────────────────────────────────
    const filteredData = patients.filter(item => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return (
            item.name?.toLowerCase().includes(s) ||
            item.contact?.toLowerCase().includes(s) ||
            item.email?.toLowerCase().includes(s) ||
            item.address?.toLowerCase().includes(s)
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfFirst = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirst, indexOfFirst + itemsPerPage);

    const totalFees = patients.reduce((s, p) => s + p.fees, 0);
    const totalAdvance = patients.reduce((s, p) => s + p.advance, 0);
    const activeCount = patients.filter(p => p.status === 1).length;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="font-sans space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patient Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Add, edit and manage patient records</p>
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
                        <UserPlus size={18} />
                        Add Patient
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{patients.length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{activeCount}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Fees</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">₹{totalFees.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Advance</p>
                    <p className="text-2xl font-bold text-cyan-600 mt-1">₹{totalAdvance.toLocaleString()}</p>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, contact, email..."
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg
                                         text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200
                                         transition-all duration-200"
                            />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                            {filteredData.length} patient{filteredData.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin text-cyan-600" size={32} />
                        <span className="ml-3 text-gray-500">Loading patients...</span>
                    </div>
                )}

                {/* Table */}
                {!loading && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-y border-gray-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Age / Sex</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fees</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Advance</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map(patient => (
                                    <tr key={patient.id} className="hover:bg-gray-50/80 transition-colors duration-150 group">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{patient.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                <Stethoscope size={11} />
                                                Ref: {doctorOptions.find(d => d.id === Number(patient.ref_by_id))?.name || "Self / Other"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-700 flex items-center gap-1.5">
                                                <Phone size={12} className="text-gray-400" /> {patient.contact}
                                            </p>
                                            {patient.email && (
                                                <p className="text-gray-500 text-xs flex items-center gap-1.5 mt-1">
                                                    <Mail size={11} className="text-gray-400" /> {patient.email}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700">{patient.age || "–"} yrs</span>
                                            <span className="mx-1.5 text-gray-300">|</span>
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                {getSexLabel(patient.sex)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ₹{patient.fees.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-cyan-600">
                                            ₹{patient.advance.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                ${patient.status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {patient.status === 1 ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openReport(patient)}
                                                    title="Create Report"
                                                    className="p-2 bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors"
                                                >
                                                    <FileText size={14} />
                                                </button>
                                                <button
                                                    onClick={() => openEdit(patient)}
                                                    title="Edit Patient"
                                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(patient.id)}
                                                    title="Delete Patient"
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                                            No patients found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredData.length > itemsPerPage && (
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

            {/* ADD / EDIT MODAL */}
            {modal && modal.type !== "report" && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal content remains the same */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {modal.type === "edit" ? "Edit Patient" : "Add Patient"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {modal.type === "edit" ? "Update patient details" : "Register a new patient"}
                                </p>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Form fields remain the same */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Patient Name <span className="text-red-500">*</span></label>
                                <input value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. Rahul Sharma"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact <span className="text-red-500">*</span></label>
                                    <input value={form.contact || ""} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
                                        placeholder="9876543210"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                    <input value={form.email || ""} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                                <input value={form.address || ""} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                                    placeholder="Pune, Maharashtra"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age</label>
                                    <input type="number" min="0" value={form.age || ""} onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                                        placeholder="30"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sex</label>
                                    <select value={form.sex || ""} onChange={e => setForm(p => ({ ...p, sex: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all cursor-pointer">
                                        <option value="">Select</option>
                                        {SEX_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Referred By</label>
                                <select value={form.ref_by_id || ""} onChange={e => setForm(p => ({ ...p, ref_by_id: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all cursor-pointer">
                                    <option value="">Select Doctor</option>
                                    {doctorOptions.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tests</label>
                                <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1">
                                    {testOptions.length === 0 ? (
                                        <p className="text-sm text-gray-400">No tests available</p>
                                    ) : testOptions.map(test => (
                                        <label key={test.id} className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                                            <input type="checkbox" checked={selectedTests.includes(test.id)} onChange={() => toggleTest(test.id)}
                                                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 cursor-pointer" />
                                            <span className="text-sm text-gray-700">{test.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {selectedTests.length > 0 && (
                                    <p className="text-xs text-cyan-600 mt-1.5 font-medium">
                                        {selectedTests.length} test{selectedTests.length !== 1 ? "s" : ""} selected
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fees (₹)</label>
                                    <input type="number" min="0" value={form.fees || ""} onChange={e => setForm(p => ({ ...p, fees: e.target.value }))}
                                        placeholder="1500"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Advance (₹)</label>
                                    <input type="number" min="0" value={form.advance || ""} onChange={e => setForm(p => ({ ...p, advance: e.target.value }))}
                                        placeholder="500"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                                <select value={form.status ?? ""} onChange={e => setForm(p => ({ ...p, status: Number(e.target.value) }))}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all cursor-pointer">
                                    <option value="">Select status</option>
                                    {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{formError}</div>
                            )}
                        </div>
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                            <button onClick={closeModal} className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={actionLoading}
                                className="px-5 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 active:bg-cyan-800 transition-all shadow-lg shadow-cyan-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {actionLoading && <Loader2 className="animate-spin" size={14} />}
                                {modal.type === "edit" ? "Save Changes" : "Add Patient"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* REPORT MODAL */}
            {modal?.type === "report" && reportPatient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">

                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <FileText size={18} className="text-violet-600" />
                                    Create Report
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Patient: <span className="font-semibold text-gray-700">{reportPatient.name}</span>
                                    <span className="mx-2 text-gray-300">|</span>
                                    {reportPatient.age} yrs, {getSexLabel(reportPatient.sex)}
                                </p>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">

                            {/* Step 1: Select Test + Collector */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Select Test <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={reportTestId}
                                        onChange={e => handleReportTestChange(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                                 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all cursor-pointer"
                                    >
                                        <option value="">— Choose a test —</option>
                                        {reportPatient.tests && reportPatient.tests.length > 0
                                            ? reportPatient.tests.map(t => (
                                                <option key={t.test_id} value={t.test_id}>{t.test_name}</option>
                                            ))
                                            : testOptions.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))
                                        }
                                    </select>
                                    {reportPatient.tests && reportPatient.tests.length === 0 && (
                                        <p className="text-xs text-amber-600 mt-1">
                                            ⚠️ No tests assigned to this patient. Please edit patient to add tests first.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Sample Collected By <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={reportCollector}
                                        onChange={e => setReportCollector(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                                 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all cursor-pointer"
                                        disabled={bloodBoysLoading}
                                    >
                                        <option value="">— Select collector —</option>
                                        {bloodBoyOptions.map(b => (
                                            <option key={b.id} value={b.id}>
                                                {b.name} {b.contact ? `(${b.contact})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {bloodBoysLoading && (
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            <Loader2 className="animate-spin" size={12} />
                                            Loading collectors...
                                        </p>
                                    )}
                                    {!bloodBoysLoading && bloodBoyOptions.length === 0 && (
                                        <p className="text-xs text-amber-600 mt-1">
                                            ⚠️ No blood collection boys available. Please add them first.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: Loading test structure */}
                            {testCatLoading && (
                                <div className="flex items-center justify-center py-10">
                                    <Loader2 className="animate-spin text-violet-600" size={28} />
                                    <span className="ml-3 text-gray-500 text-sm">Loading test structure...</span>
                                </div>
                            )}

                            {/* Step 3: Readings form */}
                            {!testCatLoading && testWithCategory && reportTestId && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-800">Enter Readings for {testWithCategory.test_name}</h3>
                                        <span className="text-xs text-gray-400">
                                            {(testWithCategory.categories || []).length} categories
                                        </span>
                                    </div>

                                    {(testWithCategory.categories || []).map(cat => (
                                        <div key={cat.category_id} className="border border-gray-200 rounded-xl overflow-hidden">

                                            {/* Category header */}
                                            <button
                                                type="button"
                                                onClick={() => toggleCategory(cat.category_id)}
                                                className="w-full flex items-center justify-between px-4 py-3
                                                         bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-800">{cat.category_name}</span>
                                                    <span className="text-xs text-gray-400 font-normal">
                                                        ₹{cat.price} · {(cat.sub_categories || []).length} parameter{(cat.sub_categories || []).length !== 1 ? "s" : ""}
                                                    </span>
                                                </div>
                                                {collapsedCategories[cat.category_id]
                                                    ? <ChevronDown size={16} className="text-gray-400" />
                                                    : <ChevronUp size={16} className="text-gray-400" />
                                                }
                                            </button>

                                            {/* Sub-category rows */}
                                            {!collapsedCategories[cat.category_id] && (
                                                <div className="divide-y divide-gray-100">
                                                    {(cat.sub_categories || []).length === 0 ? (
                                                        <p className="px-4 py-3 text-sm text-gray-400 italic">No parameters defined for this category</p>
                                                    ) : (
                                                        cat.sub_categories.map(sub => (
                                                            <div key={sub.sub_category_id} className="px-4 py-3 grid grid-cols-12 gap-3 items-center">

                                                                <div className="col-span-4">
                                                                    <p className="text-sm font-medium text-gray-800">{sub.sub_category_name}</p>
                                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                                        {sub.unit && <span className="font-mono">{sub.unit}</span>}
                                                                        {sub.normal_range_min !== undefined && sub.normal_range_max !== undefined && (
                                                                            <span className="ml-1">
                                                                                · Normal: {sub.normal_range_min}–{sub.normal_range_max}
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div className="col-span-3">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter value"
                                                                        value={readings[sub.sub_category_id]?.value_text || ""}
                                                                        onChange={e => {
                                                                            const v = e.target.value;
                                                                            updateReading(sub.sub_category_id, "value_text", v);
                                                                            const numValue = parseFloat(v);
                                                                            updateReading(sub.sub_category_id, "value", isNaN(numValue) ? 0 : numValue);
                                                                        }}
                                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                                                                                 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                                                                    />
                                                                </div>

                                                                <div className="col-span-5">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Remarks (optional)"
                                                                        value={readings[sub.sub_category_id]?.remarks || ""}
                                                                        onChange={e => updateReading(sub.sub_category_id, "remarks", e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                                                                                 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Show message when no test is selected */}
                            {!testCatLoading && !testWithCategory && reportTestId === "" && (
                                <div className="text-center py-8 text-gray-400">
                                    <FileText size={48} className="mx-auto mb-3 opacity-50" />
                                    <p>Select a test to start entering readings</p>
                                    {reportPatient.tests && reportPatient.tests.length === 0 && (
                                        <p className="text-sm text-amber-600 mt-2">
                                            Note: This patient has no tests assigned. Please edit the patient to add tests first.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Error */}
                            {(formError || reportError) && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                                    {formError || reportError}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                            <button onClick={closeModal}
                                className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReport}
                                disabled={reportLoading || !reportTestId || !reportCollector || bloodBoysLoading}
                                className="px-6 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium
                                         hover:bg-violet-700 active:bg-violet-800 transition-all
                                         shadow-lg shadow-violet-600/30 disabled:opacity-50
                                         disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {reportLoading && <Loader2 className="animate-spin" size={14} />}
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientManagement;