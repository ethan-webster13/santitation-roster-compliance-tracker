import { useState } from "react";
import { useRoster } from "../context/RosterContext";
import '../css/scheduler.css';

const CHEMICAL_RANGES = {
    "Quat Sanitizer": { min: 200, max: 400 },
    "Chlorine": { min: 50, max: 200 }
};

const isInRange = (chemicalName, ppmValue) => {
    const range = CHEMICAL_RANGES[chemicalName];
    if (!range || ppmValue === '' || ppmValue === null || ppmValue === undefined) return null;
    const num = Number(ppmValue);
    if (Number.isNaN(num)) return null;
    return num >= range.min && num <= range.max;
};

const OperationalComplianceModal = ({ areaId, areaTitle, initialData, onClose }) => {
    const { updateOperationalLog } = useRoster();

    const [turnover, setTurnover] = useState(initialData?.turnover ?? {
        actualTurnoverTime: ''
    });

    const [titration, setTitration] = useState(initialData?.titration ?? {
        chemicalName: '',
        concentrationPPM: ''
    });

    const [water, setWater] = useState(initialData?.water ?? {
        pressurePSI: '',
        temperatureF: ''
    });

    const [qaWalk, setQaWalk] = useState(initialData?.qaWalk ?? {
        inspectorId: '',
        deficienciesFound: false,
        deficiencyNotes: '',
        correctiveAction: '',
        recheckPassed: false
    });

    const [usdaWalk, setUsdaWalk] = useState(initialData?.usdaWalk ?? {
        inspectorId: '',
        deficienciesFound: false,
        deficiencyNotes: '',
        correctiveAction: '',
        recheckPassed: false
    });

    const [finalSanitizer, setFinalSanitizer] = useState(initialData?.finalSanitizer ?? {
        chemicalName: '',
        measuredPPM: '',
        correctiveAction: '',
        recheckPPM: ''
    });

    // ─── Derived pass/fail state ───
    const finalPass = isInRange(finalSanitizer.chemicalName, finalSanitizer.measuredPPM);
    const finalNeedsRecheck = finalPass === false;
    const finalRecheckPass = isInRange(finalSanitizer.chemicalName, finalSanitizer.recheckPPM);

    const qaBlocked = qaWalk.deficienciesFound && !qaWalk.recheckPassed;
    const usdaBlocked = usdaWalk.deficienciesFound && !usdaWalk.recheckPassed;
    const finalBlocked = finalNeedsRecheck && finalRecheckPass !== true;

    const canSubmit = !qaBlocked && !usdaBlocked && !finalBlocked;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        updateOperationalLog(areaId, {
            turnover,
            titration,
            water,
            qaWalk,
            usdaWalk,
            finalSanitizer,
            completedAt: new Date().toISOString()
        });
        onClose();
    };

    const handleSaveProgress = () => {
        updateOperationalLog(areaId, {
            turnover,
            titration,
            water,
            qaWalk,
            usdaWalk,
            finalSanitizer,
            completedAt: null
        });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card modal-card-lg">
                <h3>Operational Compliance: {areaTitle}</h3>
                <p className="modal-subtitle">Turnover, Titration, Water, QA/USDA Walks & Final Sanitizer Check</p>

                <form onSubmit={handleSubmit} className="form-group">

                    {/* ─── TURNOVER TIME ─── */}
                    <h4 className="step-header">Turnover Time</h4>
                    <label>Actual Turnover Time:</label>
                    <input
                        type="datetime-local"
                        required
                        value={turnover.actualTurnoverTime}
                        onChange={(e) => setTurnover({ ...turnover, actualTurnoverTime: e.target.value })}
                    />

                    {/* ─── TITRATION ─── */}
                    <h4 className="step-header">Chemical Titration</h4>
                    <div className="input-grid">
                        <div>
                            <label>Chemical:</label>
                            <select
                                required
                                value={titration.chemicalName}
                                onChange={(e) => setTitration({ ...titration, chemicalName: e.target.value })}
                            >
                                <option value="">Select chemical...</option>
                                {Object.keys(CHEMICAL_RANGES).map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Measured Concentration (PPM):</label>
                            <input
                                type="number"
                                required
                                value={titration.concentrationPPM}
                                onChange={(e) => setTitration({ ...titration, concentrationPPM: e.target.value })}
                                placeholder="e.g. 300"
                            />
                        </div>
                    </div>

                    {/* ─── WATER METRICS ─── */}
                    <h4 className="step-header">Water Metrics</h4>
                    <div className="input-grid">
                        <div>
                            <label>Water Pressure (PSI):</label>
                            <input
                                type="number"
                                required
                                value={water.pressurePSI}
                                onChange={(e) => setWater({ ...water, pressurePSI: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Water Temperature (°F):</label>
                            <input
                                type="number"
                                required
                                value={water.temperatureF}
                                onChange={(e) => setWater({ ...water, temperatureF: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* ─── QA WALK ─── */}
                    <h4 className="step-header">QA Pre-Ops Walk</h4>
                    <label>QA Inspector ID:</label>
                    <input
                        type="text"
                        required
                        value={qaWalk.inspectorId}
                        onChange={(e) => setQaWalk({ ...qaWalk, inspectorId: e.target.value })}
                    />
                    <label className="loto-checkbox-wrapper">
                        <input
                            type="checkbox"
                            checked={qaWalk.deficienciesFound}
                            onChange={(e) => setQaWalk({ ...qaWalk, deficienciesFound: e.target.checked, recheckPassed: false })}
                        />
                        <span>Deficiencies found during QA walk</span>
                    </label>

                    {qaWalk.deficienciesFound && (
                        <div style={{ borderLeft: "3px solid #ef4444", paddingLeft: "12px", marginTop: "8px" }}>
                            <label>Deficiency Notes:</label>
                            <textarea
                                required
                                rows={2}
                                value={qaWalk.deficiencyNotes}
                                onChange={(e) => setQaWalk({ ...qaWalk, deficiencyNotes: e.target.value })}
                                placeholder="Describe what QA found..."
                            />
                            <label>Corrective Action Taken:</label>
                            <textarea
                                required
                                rows={2}
                                value={qaWalk.correctiveAction}
                                onChange={(e) => setQaWalk({ ...qaWalk, correctiveAction: e.target.value })}
                                placeholder="Describe the fix..."
                            />
                            <label className="loto-checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    checked={qaWalk.recheckPassed}
                                    onChange={(e) => setQaWalk({ ...qaWalk, recheckPassed: e.target.checked })}
                                />
                                <span>Re-check completed and area now passes</span>
                            </label>
                            {!qaWalk.recheckPassed && (
                                <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>
                                    ⚠️ Submission blocked until re-check passes.
                                </p>
                            )}
                        </div>
                    )}

                    {/* ─── USDA WALK ─── */}
                    <h4 className="step-header">USDA Walk</h4>
                    <label>USDA Inspector ID:</label>
                    <input
                        type="text"
                        required
                        value={usdaWalk.inspectorId}
                        onChange={(e) => setUsdaWalk({ ...usdaWalk, inspectorId: e.target.value })}
                    />
                    <label className="loto-checkbox-wrapper">
                        <input
                            type="checkbox"
                            checked={usdaWalk.deficienciesFound}
                            onChange={(e) => setUsdaWalk({ ...usdaWalk, deficienciesFound: e.target.checked, recheckPassed: false })}
                        />
                        <span>Deficiencies found during USDA walk</span>
                    </label>

                    {usdaWalk.deficienciesFound && (
                        <div style={{ borderLeft: "3px solid #ef4444", paddingLeft: "12px", marginTop: "8px" }}>
                            <label>Deficiency Notes:</label>
                            <textarea
                                required
                                rows={2}
                                value={usdaWalk.deficiencyNotes}
                                onChange={(e) => setUsdaWalk({ ...usdaWalk, deficiencyNotes: e.target.value })}
                                placeholder="Describe what USDA found..."
                            />
                            <label>Corrective Action Taken:</label>
                            <textarea
                                required
                                rows={2}
                                value={usdaWalk.correctiveAction}
                                onChange={(e) => setUsdaWalk({ ...usdaWalk, correctiveAction: e.target.value })}
                                placeholder="Describe the fix..."
                            />
                            <label className="loto-checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    checked={usdaWalk.recheckPassed}
                                    onChange={(e) => setUsdaWalk({ ...usdaWalk, recheckPassed: e.target.checked })}
                                />
                                <span>Re-check completed and area now passes</span>
                            </label>
                            {!usdaWalk.recheckPassed && (
                                <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>
                                    ⚠️ Submission blocked until re-check passes.
                                </p>
                            )}
                        </div>
                    )}

                    {/* ─── FINAL SANITIZER PPM ─── */}
                    <h4 className="step-header alert-header">Final Sanitizer PPM Check</h4>
                    <div className="input-grid">
                        <div>
                            <label>Chemical:</label>
                            <select
                                required
                                value={finalSanitizer.chemicalName}
                                onChange={(e) => setFinalSanitizer({
                                    ...finalSanitizer,
                                    chemicalName: e.target.value,
                                    measuredPPM: '',
                                    correctiveAction: '',
                                    recheckPPM: ''
                                })}
                            >
                                <option value="">Select chemical...</option>
                                {Object.keys(CHEMICAL_RANGES).map(name => (
                                    <option key={name} value={name}>
                                        {name} ({CHEMICAL_RANGES[name].min}–{CHEMICAL_RANGES[name].max} PPM)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Measured PPM:</label>
                            <input
                                type="number"
                                required
                                disabled={!finalSanitizer.chemicalName}
                                value={finalSanitizer.measuredPPM}
                                onChange={(e) => setFinalSanitizer({ ...finalSanitizer, measuredPPM: e.target.value })}
                            />
                        </div>
                    </div>

                    {finalPass !== null && (
                        <p style={{ color: finalPass ? "#10b981" : "#ef4444", fontWeight: "bold" }}>
                            {finalPass ? "✓ Within food-safe range." : "⚠️ Out of range — redo required."}
                        </p>
                    )}

                    {finalNeedsRecheck && (
                        <div style={{ borderLeft: "3px solid #ef4444", paddingLeft: "12px", marginTop: "8px" }}>
                            <label>Corrective Action Taken:</label>
                            <textarea
                                required
                                rows={2}
                                value={finalSanitizer.correctiveAction}
                                onChange={(e) => setFinalSanitizer({ ...finalSanitizer, correctiveAction: e.target.value })}
                                placeholder="Describe the fix (re-mix solution, re-apply, etc.)..."
                            />
                            <label>Re-check PPM:</label>
                            <input
                                type="number"
                                required
                                value={finalSanitizer.recheckPPM}
                                onChange={(e) => setFinalSanitizer({ ...finalSanitizer, recheckPPM: e.target.value })}
                            />
                            {finalSanitizer.recheckPPM !== '' && (
                                <p style={{ color: finalRecheckPass ? "#10b981" : "#ef4444", fontSize: "0.85rem" }}>
                                    {finalRecheckPass ? "✓ Re-check passes." : "⚠️ Still out of range — submission blocked until it passes."}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={handleSaveProgress}>
                            Save & Close
                        </button>
                        <button
                            type="submit"
                            className="btn-save"
                            disabled={!canSubmit}
                            style={{ backgroundColor: canSubmit ? "#10b981" : "var(--border-color)" }}
                        >
                            Submit Compliance Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OperationalComplianceModal;