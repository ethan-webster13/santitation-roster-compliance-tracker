import React from "react";
import ShiftZone from "./ShiftZone";

const FacilityArea = ({ 
    areaId, 
    title, 
    zones, 
    isFullyAssigned, 
    complianceLog,
    hasDraft, 
    onInitiateHandoff 
}) => {


    return (
        <div className="facility-area">
            <h3 className="facility-area-title">{title}</h3>
            
            <div className="shift-zone-grid">
                {zones.map((zoneName, index) => (
                    <ShiftZone key={index} areaId={areaId} zoneName={zoneName} />
                ))}
            </div>

            <div 
                className="facility-area-compliance"
                style={{
                    marginTop: "15px", 
                    borderTop: "1px solid var(--border-color)", 
                    paddingTop: "15px"
                }}
            >

                {!complianceLog ? (
                    <button
                        className="btn-auto" 
                        disabled={!isFullyAssigned}
                        onClick={onInitiateHandoff}
                        style={{
                            width: "100%", 
                            padding: "10px",
                            backgroundColor: isFullyAssigned ? "#6200ee" : "var(--border-color)",
                            color: isFullyAssigned ? "#fff" : "var(--text-secondary)",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            cursor: isFullyAssigned ? "pointer" : "not-allowed",
                            transition: "background-color 0.2s ease"
                        }}
                    >
                        {isFullyAssigned ? (hasDraft ? "🔄 Resume Handoff Sequence"  : "⚡ Begin Handoff Sequence") : "🔒 Assign Full Crew to Unlock"}
                    </button>
                ) : (
                    <div
                        style={{
                            padding: "10px", 
                            backgroundColor: "rgba(16, 185, 129, 0.1)", 
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            borderRadius: "4px", 
                            color: "#10b981", 
                            fontWeight: "bold", 
                            textAlign: "center", 
                            fontSize: "0.9rem"
                        }}
                    >
                        ✓ Area Secured & LOTO Applied
                    </div>
                )}
            </div>
        </div>
        
        
    )

}

export default FacilityArea;