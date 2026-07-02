import NavBar from "../Components/NavBar";
import { useState } from "react";
import { useRoster } from "../context/RosterContext";
import OperationalComplianceModal from "../Components/OperationalComplianceModal"
import '../Components/NavBar';
import '../css/scheduler.css';


const Compliance = () => {

    const { facilityData, complianceLogs, operationalLogs }= useRoster();
    const [activeAreaModal, setActiveAreaModal] = useState(null);

    const securedAreas = facilityData.filter( area => complianceLogs[area.id]);

    const getStatus = (areaId) => {
        const log = operationalLogs?.[areaId];
        if (!log) return { label: "Not Started", color: '#6b7280'};
        if (log.completedAt) return { label: "✓ Complete", color: "#10b981" }
        return { label: "In Progress", color: '#f59e0b'};
    };

    return (
        <>
        <NavBar />
        <div className="scheduler-container">
            <div className="scheduler-header">
                <h2>Daily Compliance</h2>
            </div>

            {securedAreas.length === 0 && (
                <p style={{ padding: '20px' }}>
                    No areas have completed LOTO handoff yet. Secure an area from the Scheduler page first.
                </p>
            )}

            <div className="scheduler-grid">
                {securedAreas.map(area => {
                    const status = getStatus(area.id);
                    return (
                        <div key={area.id} className="facility-area" style={{ padding: "15px" }}>
                            <h3 className="facility-area-title">{area.title}</h3>
                            <div style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: "4px",
                                backgroundColor: `${status.color}22`,
                                color: status.color,
                                fontWeight: "bold",
                                fontSize: "0.85rem",
                                marginBottom: "12px"
                            }}>
                                {status.label}
                            </div>
                            <button
                                className="btn-auto"
                                style={{ width: "100%", padding: "10px" }}
                                onClick={() => setActiveAreaModal(area)}
                            >
                                {operationalLogs[area.id] ? "View / Edit Compliance Data" : "Enter Compliance Data"}
                            </button>
                        </div>
                        );
                })}
            </div>
            
            {activeAreaModal && (
                <OperationalComplianceModal 
                    areaId={activeAreaModal.id}
                    areaTitle={activeAreaModal.title}
                    initialData={operationalLogs[activeAreaModal.id]}
                    onClose={()=>setActiveAreaModal(null)}
                />
            )}
        </div>
        </>  
    );
};

export default Compliance