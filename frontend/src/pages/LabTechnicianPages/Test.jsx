// src/pages/LabTechnicianPages/Test.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPatients, fetchTests, fetchBloodBoys,
    fetchSubCategories, submitReport, clearReportState
} from "../../features/report/reportSlice";
import {
    User, Phone, FlaskConical, Droplets,
    Calendar, UserCog, ChevronRight, CheckCircle,
    AlertCircle, Save, Loader2, ChevronDown
} from "lucide-react";

// ── Reusable Select ──
const SelectField = ({ label, icon, value, onChange, options, placeholder, loading }) => (
    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            {label} <span className="text-red-500">*</span>
        </label>
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-600 transition-colors">
                {loading ? <Loader2 size={15} className="animate-spin" /> : icon}
            </div>
            <select value={value} onChange={e => onChange(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none
                           transition-all bg-white appearance-none text-gray-700 cursor-pointer
                           disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}>
                <option value="">{loading ? "Loading..." : placeholder}</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
    </div>
);

const Test = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { patients, tests, bloodBoys, subCategories, loading, subCatLoading, submitLoading, submitSuccess, error, reportId } = useSelector(s => s.report);

    const [form, setForm] = useState({ patient_id: "", test_id: "", sample_collected_by: "" });
    const [readings, setReadings] = useState([]);
    const [localError, setLocalError] = useState("");

    // Fetch dropdowns on mount
    useEffect(() => {
        dispatch(fetchPatients());
        dispatch(fetchTests());
        dispatch(fetchBloodBoys());
        return () => dispatch(clearReportState());
    }, [dispatch]);

    // When test changes → fetch sub-categories & reset readings
    useEffect(() => {
        if (form.test_id) {
            dispatch(fetchSubCategories(form.test_id));
            setReadings([]);
        }
    }, [form.test_id, dispatch]);

    // When sub-categories load → initialize readings
    useEffect(() => {
        if (subCategories?.length) {
            setReadings(subCategories.map(sc => ({
                sub_category_id: sc.sub_category_id,
                name: sc.sub_category_name || sc.name || `Parameter ${sc.sub_category_id}`,
                unit: sc.unit || "",
                normalRange: sc.normal_range || sc.normalRange || "",
                value: "",
                value_text: "",
                remarks: "",
            })));
        }
    }, [subCategories]);

    // On success → navigate to report
    useEffect(() => {
        if (submitSuccess && reportId) {
            const t = setTimeout(() => navigate("/technician-report"), 1500);
            return () => clearTimeout(t);
        }
    }, [submitSuccess, reportId, navigate]);

    const handleReadingChange = (index, field, val) => {
        const updated = [...readings];
        updated[index] = { ...updated[index], [field]: val };
        if (field === "value") updated[index].value_text = val; // keep in sync
        setReadings(updated);
    };

    const handleSubmit = () => {
        setLocalError("");
        if (!form.patient_id || !form.test_id || !form.sample_collected_by) {
            setLocalError("Please select patient, test, and collector."); return;
        }
        if (readings.length === 0) {
            setLocalError("No parameters found for the selected test."); return;
        }
        const emptyResults = readings.some(r => !r.value.toString().trim());
        if (emptyResults) {
            setLocalError("Please enter results for all parameters."); return;
        }

        const payload = {
            patient_id: Number(form.patient_id),
            test_id: Number(form.test_id),
            sample_collected_by: Number(form.sample_collected_by),
            readings: readings.map(r => ({
                sub_category_id: r.sub_category_id,
                value: parseFloat(r.value) || 0,
                value_text: r.value_text || r.value,
                remarks: r.remarks || "",
            })),
        };
        dispatch(submitReport(payload));
    };

    const displayError = localError || error;

    // Selected patient info for summary card
    const selectedPatient = patients.find(p => p.patient_id === Number(form.patient_id));
    const selectedTest = tests.find(t => t.test_id === Number(form.test_id));

    return (
        <div className="flex items-start justify-center py-4 px-4 font-sans">
            <div className="w-full max-w-3xl space-y-5">

                {/* ── Page Header ── */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Enter Test Result</h1>
                    <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1">
                        <span>Tests</span>
                        <ChevronRight size={14} />
                        <span className="text-cyan-600 font-medium">Enter Result</span>
                    </div>
                </div>

                {/* ── Error / Success ── */}
                {displayError && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        <span>{displayError}</span>
                    </div>
                )}
                {submitSuccess && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3">
                        <CheckCircle size={16} className="flex-shrink-0" />
                        <span>Report created successfully! (ID: {reportId}) Redirecting...</span>
                    </div>
                )}

                {/* ── Section 1: Select Patient, Test, Collector ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                        <User size={16} className="text-cyan-600" />
                        <h2 className="text-sm font-bold text-gray-800">Select Details</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <SelectField
                            label="Patient"
                            icon={<User size={15} />}
                            value={form.patient_id}
                            onChange={v => setForm(p => ({ ...p, patient_id: v }))}
                            loading={loading}
                            placeholder="Select a patient"
                            options={patients.map(p => ({
                                value: p.patient_id,
                                label: `${p.patient_name} · Age ${p.age} · ${p.patient_contact}`
                            }))}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SelectField
                                label="Test"
                                icon={<FlaskConical size={15} />}
                                value={form.test_id}
                                onChange={v => setForm(p => ({ ...p, test_id: v }))}
                                loading={loading}
                                placeholder="Select a test"
                                options={tests.map(t => ({
                                    value: t.test_id,
                                    label: `${t.test_name} (${t.test_code})`
                                }))}
                            />
                            <SelectField
                                label="Sample Collected By"
                                icon={<Droplets size={15} />}
                                value={form.sample_collected_by}
                                onChange={v => setForm(p => ({ ...p, sample_collected_by: v }))}
                                loading={loading}
                                placeholder="Select collector"
                                options={bloodBoys.map(b => ({
                                    value: b.user_id,
                                    label: b.full_name?.length > 30 ? `Collector #${b.user_id}` : b.full_name
                                }))}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Selected Patient Summary ── */}
                {selectedPatient && (
                    <div className="bg-cyan-50 border border-cyan-100 rounded-2xl px-6 py-4">
                        <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-3">Patient Summary</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: "Name", value: selectedPatient.patient_name },
                                { label: "Age / Sex", value: `${selectedPatient.age} / ${selectedPatient.sex === "1" ? "M" : "F"}` },
                                { label: "Contact", value: selectedPatient.patient_contact },
                                { label: "Test", value: selectedTest?.test_name || "—" },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{item.label}</p>
                                    <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Section 2: Parameters Table ── */}
                {form.test_id && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-cyan-600 to-cyan-700 flex items-center gap-2">
                            <FlaskConical size={16} className="text-white" />
                            <h2 className="text-sm font-bold text-white">Enter Test Results</h2>
                            {subCatLoading && <Loader2 size={14} className="text-white/70 animate-spin ml-auto" />}
                        </div>

                        {subCatLoading ? (
                            <div className="flex items-center justify-center py-12 text-gray-400">
                                <Loader2 size={20} className="animate-spin mr-2" />
                                <span className="text-sm">Loading parameters...</span>
                            </div>
                        ) : readings.length === 0 ? (
                            <div className="flex items-center justify-center py-12 text-gray-400">
                                <span className="text-sm">No parameters found for this test.</span>
                            </div>
                        ) : (
                            <>
                                {/* Table Header */}
                                <div className="grid grid-cols-[2fr_1fr_1.2fr_1.2fr_1.5fr] bg-gray-50
                                              border-b border-gray-200 px-4 py-3 gap-3">
                                    {["Parameter", "Result", "Unit", "Normal Range", "Remarks"].map(h => (
                                        <span key={h} className="text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</span>
                                    ))}
                                </div>

                                {/* Table Rows */}
                                <div className="divide-y divide-gray-100">
                                    {readings.map((row, i) => (
                                        <div key={i}
                                            className="grid grid-cols-[2fr_1fr_1.2fr_1.2fr_1.5fr] px-4 py-3 gap-3 items-center hover:bg-gray-50/60 transition-colors">
                                            <span className="text-sm font-medium text-gray-700">{row.name}</span>
                                            <input type="number" value={row.value} placeholder="—"
                                                onChange={e => handleReadingChange(i, "value", e.target.value)}
                                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm
                                                         text-gray-800 bg-gray-50 focus:border-cyan-500 focus:ring-2
                                                         focus:ring-cyan-100 outline-none transition-all placeholder:text-gray-300" />
                                            <span className="text-sm text-gray-500">{row.unit || "—"}</span>
                                            <span className="text-sm text-gray-500 font-mono">{row.normalRange || "—"}</span>
                                            <input type="text" value={row.remarks} placeholder="Optional"
                                                onChange={e => handleReadingChange(i, "remarks", e.target.value)}
                                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm
                                                         text-gray-800 bg-gray-50 focus:border-cyan-500 focus:ring-2
                                                         focus:ring-cyan-100 outline-none transition-all placeholder:text-gray-300" />
                                        </div>
                                    ))}
                                </div>

                                {/* Submit Button */}
                                <div className="px-5 pb-5 pt-4 border-t border-gray-100">
                                    <button onClick={handleSubmit} disabled={submitLoading || submitSuccess}
                                        className={`w-full flex items-center justify-center gap-2 py-3.5
                                                  text-white font-semibold text-sm rounded-xl transition-all
                                                  duration-200 shadow-lg shadow-cyan-600/30
                                                  ${submitLoading || submitSuccess
                                                ? "bg-cyan-400 cursor-not-allowed"
                                                : "bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 hover:-translate-y-0.5 hover:shadow-xl"}`}>
                                        {submitLoading ? (
                                            <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                                        ) : submitSuccess ? (
                                            <><CheckCircle size={16} /> Report Created!</>
                                        ) : (
                                            <><Save size={16} /> Save & Generate Report</>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Test;