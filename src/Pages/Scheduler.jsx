import { useState } from "react";
import { Link } from "react-router-dom";
import { useRoster } from "../context/RosterContext";
import NavBar from "../Components/NavBar";
import FacilityArea from "../Components/scheduler/FacilityArea";
import EmployeeBadge from "../Components/scheduler/EmployeeBadge";
import ZoneGatekeeperModal from "../Components/ZoneGatekeeperModal";

const Scheduler = () => {

    const { 
        liveRoster, 
        assignments,
        facilityData,
        unassignEmployee, 
        totalRequiredZones, 
        filledZonesCount, 
        autoAssignWorkers, 
        clearBoard,
        complianceLogs,
        recordComplianceLog,
        zoneDrafts,
        saveZoneDraft, 
        clearZoneDraft,
        selectedEmployeeId,
        clearSelection
    } = useRoster();

    // Look up the currently "picked up" worker so we can name them in the hint banner
    const selectedWorker = liveRoster.find(emp => emp.id === selectedEmployeeId);
    
    const [isHovered, setIsHovered] = useState(false);
    const [activeAreaModal, setActiveAreaModal] = useState(null); //Tracks which area's modal is open

    const allAreasFilled = filledZonesCount === totalRequiredZones;
    const hasAssignments = Object.keys(assignments).length > 0;
    const unassignedWorkers = liveRoster.filter(emp => !assignments[emp.id] && !emp.isAbsent);

    //Area Modal Submission Function
    const handleActivationComplete = (areaId, compliancePackage) => {
        recordComplianceLog( areaId, compliancePackage)
        clearZoneDraft(areaId);
        setActiveAreaModal(null)
    };

    const handleSaveAndCloseDraft = (areaID, draftData) => {
        saveZoneDraft(prev => ({
            ...prev,
            [areaID]: draftData
        }));
        setActiveAreaModal(null)
    }

    const handleLogShift = () => {
        if (!allAreasFilled) return;

        let logText = `FACILITY SANITATION COMPLIANCE LOG\n`;
        logText += `Date: ${new Date().toLocaleDateString()}\n`;
        logText += `Status: 100% Coverage secured \n`;
        logText += `==========================================\n\n`;

        facilityData.forEach(area => {
            logText += `Area: ${area.title}\n`;
            
            if (complianceLogs[area.id]) {
                logText += `  [✓] Floor Handover Verified: ${new Date(complianceLogs[area.id].handoff.timestamp).toLocaleTimeString()}\n`;
                logText += `  [✓] Zero Energy, Supervisor Control LOTO: Active/Valid.  Applied: ${new Date(complianceLogs[area.id].loto.timestamp).toLocaleTimeString()}\n`;
            } else {
                logText += ` [⚠️] AREA NOT SECURED BY LOTO\n`;
            }


            area.zones.forEach(zoneName => {
                const assignedEmpId = Object.keys(assignments).find(empId =>
                    assignments[empId].areaId === area.id && assignments[empId].zoneName === zoneName
                );
                
                if (assignedEmpId) {
                    const worker = liveRoster.find(emp => emp.id.toString() === assignedEmpId.toString());
                    if (worker) {
                        logText += ` - [${zoneName}]: ${worker.firstName} ${worker.lastName} (${worker.role.toUpperCase()})\n`;
                    }
                } else {
                    logText += ` - [${zoneName}]: UNASSIGNED (VACANT)\n`;
                }
            });
            logText += `\n`;
        });

        const blob = new Blob([logText], { type: "text/plain;charset=utf-8" });
        const fileUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = `sanitation-compliance-log-${new Date().toISOString().split('T')[0]}.txt`;
        downloadLink.click();
        URL.revokeObjectURL(fileUrl);
    };

    const handleDropOnBench = (e) => {
        e.preventDefault();
        setIsHovered(false);
        const empId = parseInt(e.dataTransfer.getData("text/plain"), 10);
        if (empId) unassignEmployee(empId);
    };

    /* TAP-TO-ASSIGN (touch path): if a worker is selected, tapping the bench
       sends them back to unassigned. Otherwise the tap is a no-op. */
    const handleBenchTap = () => {
        if (selectedEmployeeId !== null) unassignEmployee(selectedEmployeeId);
    };

    return (
        <>
            <NavBar />
            <div className="scheduler-container">

                {/* ─── MANAGEMENT TOOLBAR HEADER ─── */}
                <div className="scheduler-header">
                    <h2>Facility Shift Scheduler</h2>
                    
                    <div className="toolbar-container">
                        <button
                            onClick={clearBoard}
                            disabled={!hasAssignments}
                            className="btn-clear"
                        >
                            🗑️ Clear Board
                        </button>
                        
                        <button
                            onClick={autoAssignWorkers}
                            disabled={unassignedWorkers.length === 0 || allAreasFilled}
                            className="btn-auto"
                        >
                            ⚡ Auto-Assign Crew
                        </button>
                        
                        <Link
                        to="/compliance"
                        className="btn-auto"
                        style={{ textDecoration: "none", display: "inline-flex", textAlign: "center", borderRadius: '4px' }}
                        >
                        📋 Daily Compliance
                        </Link>

                        <div className="log-shift-group">
                            <button
                                onClick={handleLogShift}
                                disabled={!allAreasFilled}
                                className="btn-log"
                            >
                                Log Shift & Export
                            </button>
                            <span className={`status-message ${allAreasFilled ? 'ready' : 'pending'}`}>
                                {allAreasFilled 
                                    ? "✅ Ready: All stations fully manned." 
                                    : `⚠️ Coverage: ${filledZonesCount}/${totalRequiredZones} areas assigned.`
                                }
                            </span>
                        </div>
                    </div>
                </div>

                

                {/* ─── TAP-TO-ASSIGN HINT BANNER ─── */}
                {selectedWorker && (
                    <div className="selection-banner" role="status" aria-live="polite">
                        <span>
                            <strong>{selectedWorker.firstName} {selectedWorker.lastName}</strong> selected — tap a zone to assign, or the bench to unassign.
                        </span>
                        <button className="btn-cancel-selection" onClick={clearSelection}>
                            Cancel
                        </button>
                    </div>
                )}

                {/* ─── AVAILABLE UNASSIGNED BENCH ─── */}
                <div className={`unassigned-sidebar ${isHovered ? 'drag-hover' : ''} ${selectedEmployeeId !== null ? 'is-targetable' : ''}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setIsHovered(true)}
                    onDragLeave={() => setIsHovered(false)}
                    onDrop={handleDropOnBench}
                    onClick={handleBenchTap}
                >
                    <strong>Available Unassigned Crew (drag or tap a member, then a zone)</strong>
                    <div className="unassigned-bench">
                        {unassignedWorkers.map(emp => (
                            <EmployeeBadge key={emp.id} employee={emp} />
                        ))}
                        {unassignedWorkers.length === 0 && (
                            <span className="bench-empty-text">All crew members deployed.</span>
                        )}
                    </div>
                </div>
                
                {/* ─── FACILITY GRID MAP ─── */}
                <div className="scheduler-grid">
                    {facilityData.map(area => {
                        const isAreaFullyAssigned = area.zones.every(zoneName =>
                            Object.values(assignments).some( a => a.areaId === area.id && a.zoneName === zoneName) 
                        );

                        return (
                            <FacilityArea 
                                key={area.id}
                                areaId={area.id}
                                title={area.title}
                                zones={area.zones}
                                isFullyAssigned={isAreaFullyAssigned}
                                complianceLog={complianceLogs[area.id]}
                                hasDraft={!!zoneDrafts[area.id]}
                                onInitiateHandoff={()=>setActiveAreaModal(area)}
                            />
                        );
                    })}

                    {activeAreaModal &&  (
                        <ZoneGatekeeperModal
                            zoneName={activeAreaModal.title}
                            initialData={zoneDrafts[activeAreaModal.id]}
                            onClose={()=> setActiveAreaModal(null)}
                            onComplete={(zoneName, compliancePackage) => 
                                handleActivationComplete(activeAreaModal.id, compliancePackage)
                            }
                            onSaveAndClose={(zoneName, draftData) =>
                                handleSaveAndCloseDraft(activeAreaModal.id, draftData)
                            }
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Scheduler;