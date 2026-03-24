// src/pages/AdminPages/PatientManagement.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Plus, Pencil, Trash2, X, Search, Filter,
    ChevronLeft, ChevronRight, Download, Loader2,
    UserPlus, Phone, Mail, MapPin, IndianRupee, Stethoscope
} from "lucide-react";
import { fetchPatients, addPatient, updatePatient, deletePatient, resetPatientState } from "../../features/admin/PatientSlice";
import { fetchTests } from "../../features/admin/TestSlice";
import { fetchDoctors } from "../../features/admin/GetDoctorsSlice";
import { getProfile } from "../../features/profile/profileSlice";

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
    const { patients: apiPatients, loading, actionLoading } = useSelector(state => state.patients);
    const { tests: apiTests } = useSelector(state => state.tests);
    const { doctors: apiDoctors } = useSelector(state => state.doctorList);
    const { user } = useSelector(state => state.profile);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [selectedTests, setSelectedTests] = useState([]);

    useEffect(() => {
        dispatch(fetchPatients());
        dispatch(fetchTests());
        if (!user) {
            dispatch(getProfile());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (user && user.lab_id) {
            dispatch(fetchDoctors(user.lab_id));
        }
    }, [dispatch, user]);

    // Map API patients
    const patients = (Array.isArray(apiPatients) ? apiPatients : []).map(p => ({
        id: p.patient_id || p.id,
        name: p.patient_name || "",
        address: p.patient_address || "",
        contact: p.patient_contact || "",
        email: p.patient_email || "",
        sex: p.sex || "",
        age: p.age || "",
        ref_by_id: p.ref_by_id || "",
        test_ids: p.test_ids || [],
        status: p.status,
        fees: p.fees || 0,
        advance: p.advance || 0,
        created_at: p.created_at || "",
    }));

    // Map API tests for dropdown
    const testOptions = (Array.isArray(apiTests) ? apiTests : []).map(t => ({
        id: t.test_id || t.id,
        name: t.test_name || t.name || "",
    }));

    // Map API doctors for dropdown
    const doctorOptions = (Array.isArray(apiDoctors) ? apiDoctors : []).map(d => ({
        id: d.doctore_id || d.id,
        name: d.doctore_name || d.name || "",
    }));

    const openAdd = () => {
        setForm({});
        setSelectedTests([]);
        setModal({ type: "add" });
    };

    const openEdit = (item) => {
        setForm({ ...item });
        setSelectedTests(item.test_ids || []);
        setModal({ type: "edit", item });
    };

    const closeModal = () => setModal(null);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this patient?")) return;
        await dispatch(deletePatient(id));
        dispatch(fetchPatients());
    };

    const toggleTest = (testId) => {
        setSelectedTests(prev =>
            prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
        );
    };

    const handleSave = async () => {
        if (!form.name) return alert("Patient Name is required");
        if (!form.contact) return alert("Contact Number is required");

        const payload = {
            patient_name: form.name,
            patient_address: form.address || "",
            patient_contact: form.contact,
            patient_email: form.email || "",
            sex: form.sex || "1",
            ref_by_id: Number(form.ref_by_id) || 1,
            age: Number(form.age) || 0,
            test_ids: selectedTests,
            status: Number(form.status) || 1,
            fees: Number(form.fees) || 0,
            advance: Number(form.advance) || 0,
        };

        if (modal.type === "edit") {
            await dispatch(updatePatient({ id: modal.item.id, ...payload }));
        } else {
            await dispatch(addPatient(payload));
        }

        dispatch(fetchPatients());
        closeModal();
    };

    const getSexLabel = (val) => SEX_OPTIONS.find(s => s.value === String(val))?.label || "–";

    // Search filter
    const filteredData = patients.filter(item => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return item.name?.toLowerCase().includes(s) ||
            item.contact?.toLowerCase().includes(s) ||
            item.email?.toLowerCase().includes(s) ||
            item.address?.toLowerCase().includes(s);
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="font-sans space-y-6">
            {/* Header Section */}
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
                    <p className="text-2xl font-bold text-green-600 mt-1">{patients.filter(p => p.status === 1).length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Fees</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">₹{patients.reduce((s, p) => s + (Number(p.fees) || 0), 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Advance</p>
                    <p className="text-2xl font-bold text-cyan-600 mt-1">₹{patients.reduce((s, p) => s + (Number(p.advance) || 0), 0).toLocaleString()}</p>
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
                                placeholder="Search patients by name, contact, email..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg 
                                         text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                                         transition-all duration-200"
                            />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                            {filteredData.length} patient{filteredData.length !== 1 ? 's' : ''} found
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
                                            <div>
                                                <p className="font-semibold text-gray-900">{patient.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                    <Stethoscope size={11} /> Ref: {doctorOptions.find(d => d.id === patient.ref_by_id)?.name || "Self / Other"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-gray-700 flex items-center gap-1.5">
                                                    <Phone size={12} className="text-gray-400" /> {patient.contact}
                                                </p>
                                                {patient.email && (
                                                    <p className="text-gray-500 text-xs flex items-center gap-1.5">
                                                        <Mail size={11} className="text-gray-400" /> {patient.email}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700">{patient.age || "–"} yrs</span>
                                            <span className="mx-1.5 text-gray-300">|</span>
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                {getSexLabel(patient.sex)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">₹{Number(patient.fees).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-semibold text-cyan-600">₹{Number(patient.advance).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                ${patient.status === 1
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {patient.status === 1 ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(patient)}
                                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(patient.id)}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No patients found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredData.length > 0 && (
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
                                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── ADD / EDIT MODAL ── */}
            {modal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto
                                  shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 
                                      flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {modal.type === "edit" ? "Edit Patient" : "Add Patient"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {modal.type === "edit" ? "Update patient details" : "Register a new patient"}
                                </p>
                            </div>
                            <button onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Patient Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={form.name || ""}
                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. Rahul Sharma"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                             focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                                />
                            </div>

                            {/* Contact + Email */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Contact <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={form.contact || ""}
                                        onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
                                        placeholder="9876543210"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        value={form.email || ""}
                                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Address
                                </label>
                                <input
                                    value={form.address || ""}
                                    onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                                    placeholder="Pune, Maharashtra"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                             focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                                />
                            </div>

                            {/* Age + Sex */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        value={form.age || ""}
                                        onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                                        placeholder="30"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Sex
                                    </label>
                                    <select
                                        value={form.sex || ""}
                                        onChange={e => setForm(p => ({ ...p, sex: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                                 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 cursor-pointer"
                                    >
                                        <option value="">Select</option>
                                        {SEX_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Referred By */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Referred By
                                </label>
                                <select
                                    value={form.ref_by_id || ""}
                                    onChange={e => setForm(p => ({ ...p, ref_by_id: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                             focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 cursor-pointer"
                                >
                                    <option value="">Select Doctor</option>
                                    {doctorOptions.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tests (multi-select) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Tests
                                </label>
                                <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                                    {testOptions.length === 0 && (
                                        <p className="text-sm text-gray-400">No tests available – add tests first</p>
                                    )}
                                    {testOptions.map(test => (
                                        <label key={test.id}
                                            className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={selectedTests.includes(test.id)}
                                                onChange={() => toggleTest(test.id)}
                                                className="w-4 h-4 text-cyan-600 border-gray-300 rounded 
                                                         focus:ring-cyan-500 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-700">{test.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {selectedTests.length > 0 && (
                                    <p className="text-xs text-cyan-600 mt-1.5 font-medium">
                                        {selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} selected
                                    </p>
                                )}
                            </div>

                            {/* Fees + Advance */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Fees (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={form.fees || ""}
                                        onChange={e => setForm(p => ({ ...p, fees: e.target.value }))}
                                        placeholder="1500"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Advance (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={form.advance || ""}
                                        onChange={e => setForm(p => ({ ...p, advance: e.target.value }))}
                                        placeholder="500"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                                                 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Status
                                </label>
                                <select
                                    value={form.status ?? ""}
                                    onChange={e => setForm(p => ({ ...p, status: Number(e.target.value) }))}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                                             focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 cursor-pointer"
                                >
                                    <option value="">Select status</option>
                                    {STATUS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
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
                                disabled={actionLoading}
                                className="px-5 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium
                                         hover:bg-cyan-700 active:bg-cyan-800 transition-all
                                         shadow-lg shadow-cyan-600/30 disabled:opacity-50 
                                         disabled:cursor-not-allowed flex items-center gap-2">
                                {actionLoading && <Loader2 className="animate-spin" size={14} />}
                                {modal.type === "edit" ? "Save Changes" : "Add Patient"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientManagement;
