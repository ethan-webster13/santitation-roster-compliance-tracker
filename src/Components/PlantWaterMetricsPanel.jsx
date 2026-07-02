import { useState } from "react";
import { useRoster } from "../context/RosterContext";

const PlantWaterMetricsPanel = () => {
    const { plantWaterLog, addPlantWaterReading } = useRoster();

    const [isLoggingNew, setIsLoggingNew] = useState(false);
    const [draft, setDraft] = useState({ pressurePSI: '', temperatureF: '' });
    const [showHistory, setShowHistory] = useState(false);

    const latestReading = plantWaterLog[plantWaterLog.length - 1];
    const hasAnyReading = plantWaterLog.length > 0;

    const handleSave = (e) => {
        e.preventDefault();
        addPlantWaterReading({
            pressurePSI: draft.pressurePSI,
            temperatureF: draft.temperatureF
        });
        setDraft({ pressurePSI: '', temperatureF: '' });
        setIsLoggingNew(false);
    };

    const showForm = !hasAnyReading || isLoggingNew;

    return (
        <div className="facility-area" style={{ marginBottom: "24px" }}>
            <h3 className="facility-area-title">🚿 Plant Water Metrics (Facility-Wide)</h3>

            {showForm ? (
                <form onSubmit={handleSave} className="form-group" style={{ marginBottom: 0 }}>
                    <div className="input-grid">
                        <div>
                            <label>Water Pressure (PSI):</label>
                            <input
                                type="number"
                                required
                                value={draft.pressurePSI}
                                onChange={(e) => setDraft({ ...draft, pressurePSI: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Water Temperature (°F):</label>
                            <input
                                type="number"
                                required
                                value={draft.temperatureF}
                                onChange={(e) => setDraft({ ...draft, temperatureF: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="modal-actions" style={{ marginTop: "12px", paddingTop: "12px" }}>
                        {hasAnyReading && (
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => {
                                    setIsLoggingNew(false);
                                    setDraft({ pressurePSI: '', temperatureF: '' });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                        <button type="submit" className="btn-save">
                            Save Reading
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px",
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "6px"
                    }}>
                        <div>
                            <strong>{latestReading.pressurePSI} PSI</strong> &nbsp;|&nbsp; <strong>{latestReading.temperatureF}°F</strong>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                Logged {new Date(latestReading.recordedAt).toLocaleString()}
                            </div>
                        </div>
                        <button className="btn-auto" onClick={() => setIsLoggingNew(true)}>
                            Log New Reading
                        </button>
                    </div>

                    {plantWaterLog.length > 1 && (
                        <button
                            type="button"
                            className="btn-clear-pad"
                            style={{ marginTop: "8px" }}
                            onClick={() => setShowHistory(!showHistory)}
                        >
                            {showHistory ? "Hide" : "View"} full history ({plantWaterLog.length} readings)
                        </button>
                    )}

                    {showHistory && (
                        <ul style={{ marginTop: "8px", paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            {[...plantWaterLog].reverse().map((reading, i) => (
                                <li key={i}>
                                    {reading.pressurePSI} PSI, {reading.temperatureF}°F — {new Date(reading.recordedAt).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlantWaterMetricsPanel;