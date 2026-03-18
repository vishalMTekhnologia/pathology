import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDoctor, resetDoctorState } from "../../features/admin/AddDoctorSlice";
import { UserPlus, Loader2 } from "lucide-react";

const initialForm = {
    lab_id: "",
    doc_name: "",
    doc_address: "",
    doc_contact: "",
    doc_qaulification: "",
};

const AddDoctor = () => {
    const dispatch = useDispatch();
    const { loading, success, error } = useSelector((state) => state.doctor);

    const [form, setForm] = useState(initialForm);
    const [formError, setFormError] = useState({});

    // Reset slice state on mount
    useEffect(() => {
        dispatch(resetDoctorState());
    }, [dispatch]);

    // Clear success/error after 3 seconds
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => dispatch(resetDoctorState()), 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error, dispatch]);

    const validate = () => {
        const errors = {};
        if (!form.lab_id) errors.lab_id = "Lab ID is required";
        if (!form.doc_name.trim()) errors.doc_name = "Doctor name is required";
        if (!form.doc_address.trim()) errors.doc_address = "Address is required";
        if (!form.doc_contact.trim()) errors.doc_contact = "Contact is required";
        else if (!/^\d{10,15}$/.test(form.doc_contact))
            errors.doc_contact = "Enter a valid contact number";
        if (!form.doc_qaulification.trim())
            errors.doc_qaulification = "Qualification is required";
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setFormError((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormError(errors);
            return;
        }
        dispatch(addDoctor({ ...form, lab_id: Number(form.lab_id) }));
        setForm(initialForm);
        setFormError({});
    };

    const fields = [
        { label: "Lab ID", name: "lab_id", type: "number", placeholder: "e.g. 1" },
        { label: "Doctor Name", name: "doc_name", type: "text", placeholder: "e.g. Dr. Sharma" },
        { label: "Address", name: "doc_address", type: "text", placeholder: "e.g. Pune" },
        { label: "Contact Number", name: "doc_contact", type: "text", placeholder: "e.g. 9876543210" },
        { label: "Qualification", name: "doc_qaulification", type: "text", placeholder: "e.g. MD" },
    ];

    return (
        <div style={{ padding: "28px 24px", maxWidth: 540 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{
                    background: "linear-gradient(135deg, #e0f2fe, #cffafe)",
                    borderRadius: 10, padding: 8,
                }}>
                    <UserPlus size={20} color="#0891b2" />
                </div>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
                        Add Refer Doctor
                    </h2>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                        Fill in the details to register a new doctor
                    </p>
                </div>
            </div>

            {/* Success / Error Banner */}
            {success && (
                <div style={{
                    background: "#d1fae5", border: "1px solid #6ee7b7",
                    borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                    fontSize: 13, color: "#065f46",
                }}>
                    ✅ Doctor added successfully!
                </div>
            )}
            {error && (
                <div style={{
                    background: "#fee2e2", border: "1px solid #fca5a5",
                    borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                    fontSize: 13, color: "#991b1b",
                }}>
                    ❌ {error}
                </div>
            )}

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {fields.map(({ label, name, type, placeholder }) => (
                    <div key={name}>
                        <label style={{
                            display: "block", fontSize: 12, fontWeight: 600,
                            color: "#374151", marginBottom: 5,
                        }}>
                            {label} <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                            type={type}
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            style={{
                                width: "100%",
                                padding: "9px 12px",
                                borderRadius: 8,
                                border: `1px solid ${formError[name] ? "#fca5a5" : "#e5e7eb"}`,
                                fontSize: 13,
                                color: "#111827",
                                background: "#ffffff",
                                outline: "none",
                                boxSizing: "border-box",
                                transition: "border-color 0.15s",
                            }}
                            onFocus={e => (e.target.style.borderColor = "#0891b2")}
                            onBlur={e => (e.target.style.borderColor = formError[name] ? "#fca5a5" : "#e5e7eb")}
                        />
                        {formError[name] && (
                            <p style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>
                                {formError[name]}
                            </p>
                        )}
                    </div>
                ))}

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        marginTop: 4,
                        padding: "10px 20px",
                        background: loading
                            ? "#a5f3fc"
                            : "linear-gradient(135deg, #0891b2, #06b6d4)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        transition: "opacity 0.15s",
                    }}
                >
                    {loading ? (
                        <>
                            <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                            Adding Doctor...
                        </>
                    ) : (
                        <>
                            <UserPlus size={15} />
                            Add Doctor
                        </>
                    )}
                </button>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AddDoctor;