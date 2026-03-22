// src/pages/AdminPages/PathologyDetails.jsx
import { useState } from "react";
import {
    FlaskConical, MapPin, Phone, Mail, Globe,
    Building2, Award, Shield, Pencil, Save, X, CheckCircle,
    Clock, FileText, User, Stethoscope
} from "lucide-react";

const initialDetails = {
    labName: "ABC Pathology Lab",
    registrationNo: "LAB-REG-2025-0042",
    accreditation: "NABL Accredited · ISO 15189:2012",
    address: "123 Main Street, City, State - 400001",
    phone: "+91 86868 86868",
    email: "info@abcpathlab.com",
    website: "www.abcpathlab.com",
    directorName: "Dr. Rajesh Sharma",
    directorQualification: "MD Pathology, MBBS",
    licenseNo: "MH-PATH-2025-001",
    establishedYear: "2015",
    workingHours: "Mon-Sat: 7:00 AM - 9:00 PM, Sun: 8:00 AM - 2:00 PM",
    about: "ABC Pathology Lab is a NABL accredited diagnostic center providing accurate and reliable test results. We are equipped with state-of-the-art equipment and experienced pathologists.",
};

const Field = ({ label, value, editing, field, onChange, multiline = false }) => (
    <div className="flex flex-col gap-1.5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        {editing ? (
            multiline ? (
                <textarea
                    value={value}
                    onChange={e => onChange(field, e.target.value)}
                    rows={3}
                    className="text-sm text-gray-800 bg-cyan-50/50 border border-cyan-200 rounded-lg px-3 py-2 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 resize-none transition-all"
                />
            ) : (
                <input
                    value={value}
                    onChange={e => onChange(field, e.target.value)}
                    className="text-sm text-gray-800 bg-cyan-50/50 border border-cyan-200 rounded-lg px-3 py-2 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                />
            )
        ) : (
            <p className="text-sm font-medium text-gray-800 leading-relaxed">{value || "—"}</p>
        )}
    </div>
);

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
        setTimeout(() => setSaved(false), 3000);
    };
    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const statsRow = [
        { label: "Est. Year", value: details.establishedYear, icon: <Building2 size={18} />, color: "text-violet-600", bg: "bg-violet-50" },
        { label: "Tests Available", value: "120+", icon: <FileText size={18} />, color: "text-cyan-600", bg: "bg-cyan-50" },
        { label: "Daily Patients", value: "200+", icon: <User size={18} />, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Doctors", value: "15+", icon: <Stethoscope size={18} />, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="font-sans min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

                {/* ── Page Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pathology Details</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your lab's profile and information</p>
                    </div>
                    {!editing ? (
                        <button onClick={handleEdit}
                            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 active:bg-cyan-800 transition-all shadow-lg shadow-cyan-600/25 hover:-translate-y-0.5">
                            <Pencil size={15} /> Edit Details
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                                <X size={15} /> Cancel
                            </button>
                            <button onClick={handleSave}
                                className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/25 hover:-translate-y-0.5">
                                <Save size={15} /> Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* Success Toast */}
                {saved && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
                        <CheckCircle size={17} className="flex-shrink-0" /> Details saved successfully!
                    </div>
                )}

                {/* ── Hero Banner ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Banner */}
                    <div className="h-28 bg-gradient-to-r from-cyan-600  to-cyan-500 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10" />
                        <div className="absolute right-24 bottom-0 w-24 h-24 rounded-full bg-white/10" />
                    </div>

                    {/* Lab Identity — centered */}
                    <div className="flex flex-col items-center text-center px-6 pt-6 pb-8 -mt-10 relative">
                        <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center mb-4">
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center">
                                <FlaskConical size={32} className="text-white" />
                            </div>
                        </div>

                        {editing ? (
                            <input value={form.labName} onChange={e => handleChange("labName", e.target.value)}
                                className="text-2xl font-bold text-gray-900 text-center border-b-2 border-cyan-500 outline-none bg-transparent w-full max-w-sm mb-2" />
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{details.labName}</h2>
                        )}

                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1 max-w-md">
                            <MapPin size={13} className="flex-shrink-0 text-cyan-500" />
                            {editing ? (
                                <input value={form.address} onChange={e => handleChange("address", e.target.value)}
                                    className="flex-1 text-center border-b border-gray-300 outline-none bg-transparent text-sm text-gray-600" />
                            ) : (
                                <span className="text-center">{details.address}</span>
                            )}
                        </div>

                        {/* Accreditation badge */}
                        <div className="mt-3 inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                            <CheckCircle size={12} />
                            {editing ? (
                                <input value={form.accreditation} onChange={e => handleChange("accreditation", e.target.value)}
                                    className="bg-transparent outline-none text-xs text-cyan-700 min-w-[200px]" />
                            ) : (
                                details.accreditation
                            )}
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100">
                        {statsRow.map((stat, i) => (
                            <div key={i} className={`flex flex-col items-center justify-center py-5 gap-2 ${i < statsRow.length - 1 ? "border-r border-gray-100" : ""} hover:bg-gray-50/60 transition-colors`}>
                                <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Contact & Legal Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center">
                                <Phone size={14} className="text-cyan-600" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800">Contact Information</h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Phone size={15} className="text-cyan-600" />
                                </div>
                                <Field label="Phone Number" value={editing ? form.phone : details.phone} editing={editing} field="phone" onChange={handleChange} />
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Mail size={15} className="text-cyan-600" />
                                </div>
                                <Field label="Email Address" value={editing ? form.email : details.email} editing={editing} field="email" onChange={handleChange} />
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Globe size={15} className="text-cyan-600" />
                                </div>
                                <Field label="Website" value={editing ? form.website : details.website} editing={editing} field="website" onChange={handleChange} />
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Clock size={15} className="text-cyan-600" />
                                </div>
                                <Field label="Working Hours" value={editing ? form.workingHours : details.workingHours} editing={editing} field="workingHours" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Legal & Registration */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                                <Shield size={14} className="text-violet-600" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800">Legal & Registration</h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Shield size={15} className="text-violet-600" />
                                </div>
                                <Field label="Registration No." value={editing ? form.registrationNo : details.registrationNo} editing={editing} field="registrationNo" onChange={handleChange} />
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Award size={15} className="text-violet-600" />
                                </div>
                                <Field label="License No." value={editing ? form.licenseNo : details.licenseNo} editing={editing} field="licenseNo" onChange={handleChange} />
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Building2 size={15} className="text-violet-600" />
                                </div>
                                <Field label="Established Year" value={editing ? form.establishedYear : details.establishedYear} editing={editing} field="establishedYear" onChange={handleChange} />
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <CheckCircle size={15} className="text-violet-600" />
                                </div>
                                <Field label="Accreditation" value={editing ? form.accreditation : details.accreditation} editing={editing} field="accreditation" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Director + About Row ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Director Card — 2 cols */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <User size={14} className="text-emerald-600" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800">Director / Pathologist</h3>
                        </div>

                        {/* Avatar + Info centered */}
                        <div className="p-6 flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <Stethoscope size={28} className="text-white" />
                            </div>
                            <div className="w-full space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                    {editing ? (
                                        <input value={form.directorName} onChange={e => handleChange("directorName", e.target.value)}
                                            className="w-full text-center text-sm font-semibold text-gray-800 bg-cyan-50/50 border border-cyan-200 rounded-lg px-3 py-2 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all" />
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-800">{details.directorName}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Qualification</p>
                                    {editing ? (
                                        <input value={form.directorQualification} onChange={e => handleChange("directorQualification", e.target.value)}
                                            className="w-full text-center text-sm text-gray-600 bg-cyan-50/50 border border-cyan-200 rounded-lg px-3 py-2 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all" />
                                    ) : (
                                        <p className="text-sm text-gray-600">{details.directorQualification}</p>
                                    )}
                                </div>
                                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
                                    <CheckCircle size={11} /> Verified Pathologist
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* About — 3 cols */}
                    <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                                <FileText size={14} className="text-amber-600" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800">About the Lab</h3>
                        </div>
                        <div className="p-6 h-[calc(100%-57px)] flex flex-col justify-between">
                            {editing ? (
                                <textarea value={form.about} onChange={e => handleChange("about", e.target.value)} rows={6}
                                    className="w-full flex-1 text-sm text-gray-700 bg-cyan-50/50 border border-cyan-200 rounded-xl p-4 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 resize-none transition-all leading-relaxed" />
                            ) : (
                                <p className="text-sm text-gray-600 leading-7">{details.about}</p>
                            )}

                            {/* Quick contact pills */}
                            {!editing && (
                                <div className="mt-6 flex flex-wrap gap-2">
                                    <a href={`tel:${details.phone}`}
                                        className="inline-flex items-center gap-1.5 bg-cyan-50 text-cyan-700 text-xs font-medium px-3 py-1.5 rounded-full border border-cyan-200 hover:bg-cyan-100 transition-colors">
                                        <Phone size={11} /> {details.phone}
                                    </a>
                                    <a href={`mailto:${details.email}`}
                                        className="inline-flex items-center gap-1.5 bg-cyan-50 text-cyan-700 text-xs font-medium px-3 py-1.5 rounded-full border border-cyan-200 hover:bg-cyan-100 transition-colors">
                                        <Mail size={11} /> {details.email}
                                    </a>
                                    <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
                                        <Globe size={11} /> {details.website}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PathologyDetails;