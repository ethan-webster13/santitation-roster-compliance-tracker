import { useState } from "react";
import NavBar from "../Components/NavBar";
import FacilityArea from "../Components/scheduler/FacilityArea";
import EmployeeBadge from "../Components/scheduler/EmployeeBadge";
import { useRoster } from "../context/RosterContext";
import initialLayoutData from "../data/layoutData";
import EditEmployeeModal from "../Components/EditEmployeeModal";
import '../css/scheduler.css';

const Scheduler = () => {
    const [facilityData, setFacilityData] = useState(initialLayoutData);
    const { 
        liveRoster, 
        assignments, 
        unassignEmployee, 
        totalRequiredZones, 
        filledZonesCount, 
        autoAssignWorkers, 
        clearBoard 
    } = useRoster();
    const [isHovered, setIsHovered] = useState(false);

    // Derived Utility States
    const allAreasFilled = filledZonesCount === totalRequiredZones;
    const hasAssignments = Object.keys(assignments).length > 0;
    const unassignedWorkers = liveRoster.filter(emp => !assignments[emp.id] && !emp.isAbsent);

    const handleLogShift = () => {
        if (!allAreasFilled) return;

        let logText = `FACILITY SANITATION COMPLIANCE LOG\n`;
        logText += `Date: ${new Date().toLocaleDateString()}\n`;
        logText += `Status: 100% Coverage secured \n`;
        logText += `==========================================\n\n`;

        facilityData.forEach(area => {
            logText += `Area: ${area.title}\n`;
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

                

                {/* ─── AVAILABLE UNASSIGNED BENCH ─── */}
                <div className={`unassigned-sidebar ${isHovered ? 'drag-hover' : ''}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setIsHovered(true)}
                    onDragLeave={() => setIsHovered(false)}
                    onDrop={handleDropOnBench}
                >
                    <strong>Available Unassigned Crew (Drag here to unassign)</strong>
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
                    {facilityData.map(area => (
                        <FacilityArea
                            key={area.id}
                            areaId={area.id}
                            title={area.title}
                            zones={area.zones} 
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Scheduler;