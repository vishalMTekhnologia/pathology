// src/pages/AdminPages/PathologyDetails.jsx
import { useState } from "react";
import {
    FlaskConical, MapPin, Phone, Mail, Globe,
    Building2, Award, Shield, Pencil, Save, X, CheckCircle
} from "lucide-react";

const initialDetails = {
    labName: "ABC Pathology Lab",
    registrationNo: "LAB-REG-2025-0042",
    accreditation: "NABL Accredited · ISO 15189:2012",
    address: "123 Main Street, City, State - 400001",
    phone: "+91 98765 43210",
    email: "info@abcpathlab.com",
    website: "www.abcpathlab.com",
    directorName: "Dr. Rajesh Sharma",
    directorQualification: "MD Pathology, MBBS",
    licenseNo: "MH-PATH-2025-001",
    establishedYear: "2015",
    workingHours: "Mon-Sat: 7:00 AM - 9:00 PM, Sun: 8:00 AM - 2:00 PM",
    about: "ABC Pathology Lab is a NABL accredited diagnostic center providing accurate and reliable test results. We are equipped with state-of-the-art equipment and experienced pathologists.",
};

const PathologyDetails = () => {
    const [details, setDetails] = useState(initialDetails);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(initialDetails);
    const [saved, setSaved] = useState(false);

    const handleEdit = () => { setForm({ ...details }); setEditing(true); };
    const handleCancel = () => { setEditing(false); };
    const handleSave = () => {
        setDetails({ ...form });
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };
    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const infoCards = [
        { label: "Registration No.", value: details.registrationNo, icon: <Shield size={18} />, field: "registrationNo" },
        { label: "License No.", value: details.licenseNo, icon: <Award size={18} />, field: "licenseNo" },
        { label: "Established", value: details.establishedYear, icon: <Building2 size={18} />, field: "establishedYear" },
        { label: "Accreditation", value: details.accreditation, icon: <CheckCircle size={18} />, field: "accreditation" },
        { label: "Phone", value: details.phone, icon: <Phone size={18} />, field: "phone" },
        { label: "Email", value: details.email, icon: <Mail size={18} />, field: "email" },
        { label: "Website", value: details.website, icon: <Globe size={18} />, field: "website" },
        { label: "Working Hours", value: details.workingHours, icon: <Building2 size={18} />, field: "workingHours" },
    ];

    return (
        <div className="font-sans space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pathology Details</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your lab's information and details</p>
                </div>
                {!editing ? (
                    <button onClick={handleEdit}
                        className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/30">
                        <Pencil size={16} /> Edit Details
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            <X size={16} /> Cancel
                        </button>
                        <button onClick={handleSave}
                            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/30">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                )}
            </div>

            {saved && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                    <CheckCircle size={18} /> Details saved successfully!
                </div>
            )}

            {/* Lab Hero Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-cyan-600 to-cyan-700 relative">
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
                </div>
                <div className="px-8 pt-5 pb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-50 border-2 border-cyan-200 flex items-center justify-center shadow-md">
                            <FlaskConical size={32} className="text-cyan-600" />
                        </div>
                        <div className="flex-1">
                            {editing ? (
                                <input value={form.labName} onChange={e => handleChange("labName", e.target.value)}
                                    className="text-xl font-bold text-gray-900 border-b-2 border-cyan-500 outline-none bg-transparent w-full mb-2" />
                            ) : (
                                <h2 className="text-xl font-bold text-gray-900 mb-1">{details.labName}</h2>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin size={14} />
                                {editing ? (
                                    <input value={form.address} onChange={e => handleChange("address", e.target.value)}
                                        className="flex-1 border-b border-gray-300 outline-none bg-transparent text-sm" />
                                ) : (
                                    <span>{details.address}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800">Lab Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100">
                    {infoCards.map((card, i) => (
                        <div key={i} className="bg-white px-6 py-5 flex items-start gap-4 hover:bg-gray-50/60 transition-colors">
                            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                {card.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{card.label}</p>
                                {editing ? (
                                    <input value={form[card.field]} onChange={e => handleChange(card.field, e.target.value)}
                                        className="w-full text-sm font-medium text-gray-800 border-b border-gray-300 outline-none bg-transparent" />
                                ) : (
                                    <p className="text-sm font-medium text-gray-800 break-words">{card.value || "—"}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Director Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Director / Pathologist</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Name</p>
                        {editing ? (
                            <input value={form.directorName} onChange={e => handleChange("directorName", e.target.value)}
                                className="w-full text-sm font-medium text-gray-800 border-b border-gray-300 outline-none bg-transparent" />
                        ) : (
                            <p className="text-sm font-medium text-gray-800">{details.directorName}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Qualification</p>
                        {editing ? (
                            <input value={form.directorQualification} onChange={e => handleChange("directorQualification", e.target.value)}
                                className="w-full text-sm font-medium text-gray-800 border-b border-gray-300 outline-none bg-transparent" />
                        ) : (
                            <p className="text-sm font-medium text-gray-800">{details.directorQualification}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3">About the Lab</h3>
                {editing ? (
                    <textarea value={form.about} onChange={e => handleChange("about", e.target.value)} rows={4}
                        className="w-full text-sm text-gray-700 border border-gray-200 rounded-xl p-3 outline-none focus:border-cyan-500 resize-none" />
                ) : (
                    <p className="text-sm text-gray-700 leading-relaxed">{details.about}</p>
                )}
            </div>
        </div>
    );
};

export default PathologyDetails;
