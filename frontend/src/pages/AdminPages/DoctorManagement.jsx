import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../features/admin/GetDoctorsSlice";
import { addDoctor, resetDoctorState } from "../../features/admin/AddDoctorSlice";
import { updateDoctor, resetUpdateDoctorState } from "../../features/admin/UpdateDoctorSlice";
import { UserPlus, UserCog, X, Loader2, Search } from "lucide-react";

const LAB_ID = 1;

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ title, icon, onClose, children }) => (
    <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {icon}
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                    <X size={18} />
                </button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

// ─── Reusable Form ────────────────────────────────────────────────────────────
const DoctorForm = ({ fields, form, formError, handleChange, handleSubmit, loading, accentClass, loadingLabel, btnLabel }) => (
    <div className="space-y-4">
        {fields.map(({ label, name, type, placeholder }) => (
            <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {label} <span className="text-red-500">*</span>
                </label>
                <input
                    type={type} name={name} value={form[name]}
                    onChange={handleChange} placeholder={placeholder}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-cyan-200 transition-all
                        ${formError[name] ? "border-red-400" : "border-gray-200 focus:border-cyan-500"}`}
                />
                {formError[name] && (
                    <p className="text-red-500 text-xs mt-1">{formError[name]}</p>
                )}
            </div>
        ))}
        <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full mt-2 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all
                ${loading ? "bg-cyan-300 cursor-not-allowed" : accentClass}`}
        >
            {loading
                ? <><Loader2 size={14} className="animate-spin" />{loadingLabel}</>
                : btnLabel
            }
        </button>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const DoctorManagement = () => {
    const dispatch = useDispatch();
    const { loading: listLoading, doctors, error: listError } = useSelector((s) => s.doctorList);
    const { loading: addLoading, success: addSuccess, error: addError } = useSelector((s) => s.doctor);
    const { loading: updateLoading, success: updateSuccess, error: updateError } = useSelector((s) => s.doctorUpdate);

    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const initialAdd = { doc_name: "", doc_address: "", doc_contact: "", doc_qaulification: "" };
    const initialUpdate = { doc_id: "", doc_name: "", doc_address: "", doc_contact: "", doc_qaulification: "" };

    const [addForm, setAddForm] = useState(initialAdd);
    const [addFormError, setAddFormError] = useState({});
    const [updateForm, setUpdateForm] = useState(initialUpdate);
    const [updateFormError, setUpdateFormError] = useState({});

    useEffect(() => { dispatch(fetchDoctors(LAB_ID)); }, [dispatch]);

    useEffect(() => {
        if (addSuccess) {
            setTimeout(() => {
                dispatch(resetDoctorState());
                setShowAdd(false);
                setAddForm(initialAdd);
                dispatch(fetchDoctors(LAB_ID));
            }, 1500);
        }
    }, [addSuccess]);

    useEffect(() => {
        if (updateSuccess) {
            setTimeout(() => {
                dispatch(resetUpdateDoctorState());
                setShowUpdate(false);
                setUpdateForm(initialUpdate);
                dispatch(fetchDoctors(LAB_ID));
            }, 1500);
        }
    }, [updateSuccess]);

    const validate = (form, isUpdate = false) => {
        const errors = {};
        if (isUpdate && !form.doc_id) errors.doc_id = "Doctor ID is required";
        if (!form.doc_name.trim()) errors.doc_name = "Doctor name is required";
        if (!form.doc_address.trim()) errors.doc_address = "Address is required";
        if (!form.doc_contact.trim()) errors.doc_contact = "Contact is required";
        else if (!/^\d{10,15}$/.test(form.doc_contact)) errors.doc_contact = "Enter a valid contact number";
        if (!form.doc_qaulification.trim()) errors.doc_qaulification = "Qualification is required";
        return errors;
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setAddForm(p => ({ ...p, [name]: value }));
        setAddFormError(p => ({ ...p, [name]: "" }));
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateForm(p => ({ ...p, [name]: value }));
        setUpdateFormError(p => ({ ...p, [name]: "" }));
    };

    const handleAddSubmit = () => {
        const errors = validate(addForm);
        if (Object.keys(errors).length > 0) { setAddFormError(errors); return; }
        dispatch(addDoctor({ ...addForm }));
    };

    const handleUpdateSubmit = () => {
        const errors = validate(updateForm, true);
        if (Object.keys(errors).length > 0) { setUpdateFormError(errors); return; }
        dispatch(updateDoctor({ ...updateForm, doc_id: Number(updateForm.doc_id) }));
    };

    const openUpdate = (doc) => {
        setUpdateForm({
            doc_id: String(doc.doc_id),
            doc_name: doc.doc_name,
            doc_address: doc.doc_address,
            doc_contact: String(doc.doc_contact),
            doc_qaulification: doc.doc_qaulification,
        });
        dispatch(resetUpdateDoctorState());
        setShowUpdate(true);
    };

    const filteredDoctors = (doctors || []).filter(doc =>
        doc.doc_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(doc.doc_contact).includes(searchTerm)
    );

    const addFields = [
        { label: "Doctor Name", name: "doc_name", type: "text", placeholder: "e.g. Dr. Sharma" },
        { label: "Address", name: "doc_address", type: "text", placeholder: "e.g. Pune" },
        { label: "Contact Number", name: "doc_contact", type: "text", placeholder: "e.g. 9876543210" },
        { label: "Qualification", name: "doc_qaulification", type: "text", placeholder: "e.g. MD" },
    ];

    const updateFields = [
        { label: "Doctor ID", name: "doc_id", type: "number", placeholder: "e.g. 1" },
        ...addFields,
    ];

    return (
        <div className="font-sans space-y-6">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Refer Doctors</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {(doctors || []).length} doctor{(doctors || []).length !== 1 ? "s" : ""} registered
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    
                    <button
                        onClick={() => { dispatch(resetDoctorState()); setAddForm(initialAdd); setAddFormError({}); setShowAdd(true); }}
                        className="flex items-center gap-2 bg-cyan-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-cyan-700 active:bg-cyan-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-cyan-600/30"
                    >
                        <UserPlus size={16} /> Add Doctor
                    </button>
                </div>
            </div>

            {/* ── Main Card ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Search bar */}
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name or contact..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {listLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <Loader2 size={24} className="animate-spin" />
                            <p className="mt-3 text-sm">Loading doctors...</p>
                        </div>
                    ) : listError ? (
                        <div className="m-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                            ❌ {listError}
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-y border-gray-200">
                                    {[, "Name", "Address", "Contact", "Qualification", "Actions"].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredDoctors.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search size={24} className="text-gray-400" />
                                                <p>No doctors found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDoctors.map((doc, i) => (
                                        <tr key={doc.doc_id} className="hover:bg-gray-50/80 transition-colors duration-150 group">
                                            <td className="px-6 py-4 font-medium text-gray-900">{doc.doc_name}</td>
                                            <td className="px-6 py-4 text-gray-600">{doc.doc_address}</td>
                                            <td className="px-6 py-4 text-gray-600">{doc.doc_contact}</td>
                                            <td className="px-6 py-4 text-gray-600">{doc.doc_qaulification}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openUpdate(doc)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-xs font-semibold"
                                                    >
                                                        <UserCog size={12} /> Update
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ── Add Modal ── */}
            {showAdd && (
                <Modal
                    title="Add Refer Doctor"
                    icon={<UserPlus size={18} className="text-cyan-600" />}
                    onClose={() => { setShowAdd(false); dispatch(resetDoctorState()); }}
                >
                    {addSuccess && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
                            ✅ Doctor added successfully!
                        </div>
                    )}
                    {addError && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                            ❌ {addError}
                        </div>
                    )}
                    <DoctorForm
                        fields={addFields}
                        form={addForm}
                        formError={addFormError}
                        handleChange={handleAddChange}
                        handleSubmit={handleAddSubmit}
                        loading={addLoading}
                        accentClass="bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-600/30"
                        loadingLabel="Adding..."
                        btnLabel={<><UserPlus size={14} /> Add Doctor</>}
                    />
                </Modal>
            )}

            {/* ── Update Modal ── */}
            {showUpdate && (
                <Modal
                    title="Update Refer Doctor"
                    icon={<UserCog size={18} className="text-amber-600" />}
                    onClose={() => { setShowUpdate(false); dispatch(resetUpdateDoctorState()); }}
                >
                    {updateSuccess && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
                            ✅ Doctor updated successfully!
                        </div>
                    )}
                    {updateError && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                            ❌ {updateError}
                        </div>
                    )}
                    <DoctorForm
                        fields={updateFields}
                        form={updateForm}
                        formError={updateFormError}
                        handleChange={handleUpdateChange}
                        handleSubmit={handleUpdateSubmit}
                        loading={updateLoading}
                        accentClass="bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/30"
                        loadingLabel="Updating..."
                        btnLabel={<><UserCog size={14} /> Update Doctor</>}
                    />
                </Modal>
            )}
        </div>
    );
};

export default DoctorManagement;