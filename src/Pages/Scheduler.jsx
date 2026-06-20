import { useState } from "react";
import NavBar from "../Components/NavBar";
import FacilityArea from "../Components/scheduler/FacilityArea";
import EmployeeBadge from "../Components/scheduler/EmployeeBadge";
import { useRoster } from "../context/RosterContext";
import initialLayoutData from "../data/layoutData";
import '../Components/scheduler/scheduler.css'


const Scheduler = () => {
    const [facilityData, setFacilityData] = useState(initialLayoutData);
    const { liveRoster, assignments, unassignEmployee, totalRequiredZones, filledZonesCount } = useRoster();
    const [isHovered, setIsHovered] = useState(false);

    //Total Zones, Dynamic if more zones/areas added/removed later


    const allAreasFilled = filledZonesCount === totalRequiredZones;

    const handleLogShift = () => {
        if (!allAreasFilled) return;

        // Build a formatted text file payload resembling an official shift roster sheet
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
                    const worker = liveRoster.find(emp=> emp.id.toString() === assignedEmpId.toString());
                    if (worker) {
                        logText += ` - [${zoneName}]: ${worker.firstName} ${worker.lastName} (${worker.role.toUpperCase()})\n`;
                    }
                } else {
                    logText += ` - [${zoneName}]: UNASSIGNED (VACANT)\n`;
                }
            });
            logText += `\n`;
        });

        const blob = new Blob([logText], {type: "text/plain;charset=utf-8"});
        const fileUrl = URL.createObjectURL(blob);

        //Create temp link element, click to trigger download, then discard link
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = `sanitation-compliance-log-${new Date().toISOString().split('T')[0]}.txt`;
        downloadLink.click();
        URL.revokeObjectURL(fileUrl)
    };



    //worker shows on bench ONLY IF: They have no active assignment coordinate and they are NOT marked absent
    const unassignedWorkers = liveRoster.filter(emp => !assignments[emp.id] && !emp.isAbsent);

    // This fires when a card is dragged out of a zone and dropped back onto the top bench area
    const handleDropOnBench = (e) => {
        e.preventDefault();
        setIsHovered(false);

        // Grab the employee ID out of the event's data backpack
        const empId = parseInt(e.dataTransfer.getData("text/plain"), 10);

        /* If find the ID, remove their location mapping from our Context state.
            Because they no longer have a location, React automatically moves them back into the unassigned bench list */
        if (empId) unassignEmployee(empId)
    };

    return (
        <>
            <NavBar />
            <div className="scheduler-container">
                <h2>Facility Shift Scheduler</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <button
                            onClick={handleLogShift}
                            disabled={!allAreasFilled}
                            style={{
                                padding: '10px 20px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: 'white',
                                backgroundColor: allAreasFilled ? '#2e7d32' : '#9e9e9e',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: allAreasFilled ? 'pointer' : 'not-allowed',
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            Log Shift & Export
                        </button>
                        <span style={{ fontSize: '0.8rem', marginTop: '5px', color: allAreasFilled ? '#2e7d32' : '#d32f2f' }}>
                            {allAreasFilled 
                                ? "✅ Ready: All stations fully manned." 
                                : `⚠️ Coverage: ${filledZonesCount}/${totalRequiredZones} areas assigned.`
                            }
                        </span>
                    </div>


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
                        {unassignedWorkers.length === 0 && <span style={{color: '#888', fontSize: '0.9rem'}}>All crew members deployed.</span>}
                    </div>
                </div>
                
                <div className="scheduler-grid">
                    {facilityData.map(area=> (
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
    )
}

export default Scheduler;