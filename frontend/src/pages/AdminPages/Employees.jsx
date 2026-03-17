// PASTE YOUR Employees.jsx CODE HERE FROM THE CODE YOU SAVED IN NOTEPAD
// Full code was provided in the conversation above
// src/pages/AdminPages/Employees.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, X, Search, Filter, Download, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";

const TABS = ["Blood Collectors", "Lab Technicians", "Doctors"];

const initialData = {
    "Blood Collectors": [
        { id: 1, name: "John Doe", mobile: "+91 9123456780", email: "john@lab.com", gender: "Male", dob: "1990-05-10", idType: "Aadhar Card", status: "Active" },
        { id: 2, name: "Sara James", mobile: "+91 9871234560", email: "sara@lab.com", gender: "Female", dob: "1995-08-22", idType: "PAN Card", status: "Active" },
        { id: 3, name: "Mike Johnson", mobile: "+91 9988776655", email: "mike@lab.com", gender: "Male", dob: "1988-11-15", idType: "Passport", status: "On Leave" },
    ],
    "Lab Technicians": [
        { id: 1, name: "Priya Sharma", mobile: "+91 9876543211", email: "priya@lab.com", gender: "Female", dob: "1992-03-22", idType: "PAN Card", status: "Active" },
        { id: 2, name: "Mark Wilson", mobile: "+91 9988776655", email: "mark@lab.com", gender: "Male", dob: "1988-11-15", idType: "Passport", status: "Active" },
    ],
    "Doctors": [
        { id: 1, name: "Dr. Robert Brown", mobile: "+91 9876543210", email: "robert@lab.com", gender: "Male", dob: "1980-01-30", idType: "Medical License", status: "Active" },
        { id: 2, name: "Dr. Anjali Mehta", mobile: "+91 9812345670", email: "anjali@lab.com", gender: "Female", dob: "1985-07-14", idType: "Aadhar Card", status: "Active" },
    ],
};

const empty = { name: "", mobile: "", email: "", gender: "", dob: "", idType: "", status: "Active" };

const Employees = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Blood Collectors");
    const [data, setData] = useState(initialData);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState(empty);
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const employees = data[activeTab];

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.mobile.includes(searchTerm)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.mobile.trim()) e.mobile = "Mobile is required";
        else if (!/^\+91 [0-9]{10}$/.test(form.mobile)) e.mobile = "Invalid format (+91 XXXXXXXXXX)";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
        if (!form.gender) e.gender = "Select gender";
        if (!form.dob) e.dob = "DOB is required";
        if (!form.idType.trim()) e.idType = "ID Type is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const openEdit = (item) => {
        setEditItem(item);
        setForm({ ...item });
        setErrors({});
        setShowModal(true);
    };

    const handleSave = () => {
        if (!validate()) return;
        setData(prev => {
            const list = prev[activeTab];
            if (editItem) {
                return { ...prev, [activeTab]: list.map(e => e.id === editItem.id ? { ...form, id: editItem.id } : e) };
            } else {
                const newId = list.length ? Math.max(...list.map(e => e.id)) + 1 : 1;
                return { ...prev, [activeTab]: [...list, { ...form, id: newId }] };
            }
        });
        setShowModal(false);
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            setData(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(e => e.id !== id) }));
        }
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active": return "bg-green-100 text-green-700";
            case "On Leave": return "bg-amber-100 text-amber-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="font-sans space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Employee Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage blood collectors, technicians, and doctors</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200
                                     rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download size={16} />
                        Export
                    </button>

                    {/* ✅ Register new employee via API */}
                    <button
                        onClick={() => navigate("/employees/register")}
                        className="flex items-center gap-2 bg-cyan-600 text-white px-5 py-2.5 rounded-lg
                                 text-sm font-semibold hover:bg-cyan-700 active:bg-cyan-800
                                 transform hover:-translate-y-0.5 transition-all duration-200
                                 shadow-lg shadow-cyan-600/30"
                    >
                        <UserPlus size={18} />
                        Register Employee
                    </button>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200 bg-gray-50/50">
                    <div className="flex overflow-x-auto scrollbar-hide px-6">
                        {TABS.map(tab => (
                            <button key={tab}
                                onClick={() => { setActiveTab(tab); setSearchTerm(""); setCurrentPage(1); }}
                                className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2
                                         transition-all duration-200 flex items-center gap-2
                                         ${activeTab === tab
                                        ? 'border-cyan-600 text-cyan-700'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                    ${activeTab === tab ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {data[tab].length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search + Filter */}
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="text" placeholder="Search by name, email, or mobile..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg
                                         text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200
                                         transition-all duration-200" />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white
                                             border border-gray-200 rounded-lg hover:bg-gray-50
                                             transition-colors flex items-center gap-2 flex-1 sm:flex-none justify-center">
                                <Filter size={16} />
                                Filter
                            </button>
                            <select className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg
                                             bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200
                                             transition-all duration-200 flex-1 sm:flex-none">
                                <option>All Status</option>
                                <option>Active</option>
                                <option>On Leave</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-y border-gray-200">
                                {["NAME", "MOBILE", "EMAIL", "GENDER", "DOB", "ID TYPE", "STATUS", "ACTIONS"].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search size={24} className="text-gray-400" />
                                            <p>No employees found</p>
                                            <button
                                                onClick={() => navigate("/employees/register")}
                                                className="text-cyan-600 hover:text-cyan-700 font-medium">
                                                Register a new employee
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentEmployees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors duration-150 group">
                                        <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{emp.mobile}</td>
                                        <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{emp.gender}</td>
                                        <td className="px-6 py-4 text-gray-600">{emp.dob}</td>
                                        <td className="px-6 py-4 text-gray-600">{emp.idType}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(emp)}
                                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(emp.id)}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredEmployees.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50
                                  flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} entries
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600
                                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                        ${currentPage === i + 1 ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600
                                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal (local data only) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Edit Employee</h2>
                                <p className="text-sm text-gray-500 mt-1">Update employee details</p>
                            </div>
                            <button onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                    <input placeholder="Enter full name" value={form.name}
                                        onChange={e => handleChange("name", e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile <span className="text-red-500">*</span></label>
                                    <input placeholder="+91 XXXXXXXXXX" value={form.mobile}
                                        onChange={e => handleChange("mobile", e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all ${errors.mobile ? 'border-red-400' : 'border-gray-200'}`} />
                                    {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                                    <input placeholder="email@example.com" value={form.email}
                                        onChange={e => handleChange("email", e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                                    <select value={form.gender} onChange={e => handleChange("gender", e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all cursor-pointer ${errors.gender ? 'border-red-400' : 'border-gray-200'}`}>
                                        <option value="">Select gender</option>
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                                    <input type="date" value={form.dob} onChange={e => handleChange("dob", e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all ${errors.dob ? 'border-red-400' : 'border-gray-200'}`} />
                                    {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">ID Type <span className="text-red-500">*</span></label>
                                    <select value={form.idType} onChange={e => handleChange("idType", e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all cursor-pointer ${errors.idType ? 'border-red-400' : 'border-gray-200'}`}>
                                        <option value="">Select ID type</option>
                                        <option>Aadhar Card</option><option>PAN Card</option><option>Passport</option>
                                        <option>Driving License</option><option>Medical License</option><option>Voter ID</option>
                                    </select>
                                    {errors.idType && <p className="text-red-500 text-xs mt-1">{errors.idType}</p>}
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                                    <select value={form.status} onChange={e => handleChange("status", e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all cursor-pointer">
                                        <option>Active</option><option>On Leave</option><option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-5 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)}
                                className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave}
                                className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/30">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;