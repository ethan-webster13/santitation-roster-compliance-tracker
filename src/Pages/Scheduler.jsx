import { useState } from "react";
import NavBar from "../Components/NavBar";
import FacilityArea from "../Components/scheduler/FacilityArea";
import EmployeeBadge from "../Components/scheduler/EmployeeBadge";
import { useRoster } from "../context/RosterContext";
import initialLayoutData from "../data/layoutData";
import '../Components/scheduler/scheduler.css'

const Scheduler = () => {
    const [facilityData, setFacilityData] = useState(initialLayoutData);
    const { liveRoster, assignments, unassignEmployee } = useRoster();
    const [isHovered, setIsHovered] = useState(false);

    const unassignedWorkers = liveRoster.filter(emp => !assignments[emp.id]);

    // This fires when a card is dragged out of a zone and dropped back onto the top bench area
    const handleDropOnBench = (e) => {
        e.preventDefault();
        setIsHovered(false);

        // Grab the employee ID out of the event's data backpack
        const empId = parseInt(e.dataTransfer.getData("text/plain"), 10);

        /* If we find an ID, remove their location mapping from our Context state.
            Because they no longer have a location, React automatically moves them back into the unassigned bench list */
        if (empId) unassignEmployee(empId)
    };

    return (
        <>
            <NavBar />
            <div className="scheduler-container">
                <h2>Facility Shift Scheduler</h2>

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