import { useState } from "react";
import EmployeeBadge from "./EmployeeBadge";
import { useRoster } from "../../context/RosterContext";

const ShiftZone = ({ areaId, zoneName }) => {
    const { liveRoster, assignments, assignEmployee, selectedEmployeeId } = useRoster();
    const [isDragOver, setIsDragOver] = useState(false);

    //Look at our global assignments map and filter out ONLY the workers who belong to this exact zone
    const assignedWorkers = liveRoster.filter( emp=>
        assignments[emp.id]?.areaId === areaId && assignments[emp.id]?.zoneName === zoneName
    );

    // A worker is "picked up" via tap — this zone becomes a valid drop target
    const isTargetable = selectedEmployeeId !== null;

    const handleDragOver = (e) => {
        /* OVERRIDING THE BROWSER DEFAULT:
            By default, web browsers block you from dropping items onto random layout shapes like divs.
            If you try, your mouse cursor turns into a red "cannot drop" circle.
            Running e.preventDefault() tells the browser: "Hey, turn off that protection. I am authorizing this div to be a landing pad."
        */
        e.preventDefault();
    };

    // This fires when the user lets go of the mouse button over this specific box (desktop drag path)
    const handleDrop = (e) => {
        e.preventDefault(); // Stops the browser from doing default action
        setIsDragOver(false); // Turns off the visual hover highlight color

        // Open the browser's "backpack" and grab the employee ID string we packed inside EmployeeBadge.jsx
        const empId = parseInt(e.dataTransfer.getData("text/plain"), 10);
        if (empId) {
            // Send the ID to the Context state to officially update their scheduled location
            assignEmployee(empId, areaId, zoneName);
        }
    };

    /* TAP-TO-ASSIGN (touch path):
        If a worker is already selected, tapping anywhere in this zone drops them here.
        If nothing is selected, the tap does nothing (badges handle their own selection). */
    const handleZoneTap = () => {
        if (selectedEmployeeId !== null) {
            assignEmployee(selectedEmployeeId, areaId, zoneName);
        }
    };

    const handleKeyDown = (e) => {
        if (isTargetable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleZoneTap();
        }
    };

  return (
    <div
      className={`shift-zone ${isDragOver ? 'drag-hover' : ''} ${isTargetable ? 'is-targetable' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={handleZoneTap}
      onKeyDown={handleKeyDown}
      role={isTargetable ? "button" : undefined}
      tabIndex={isTargetable ? 0 : undefined}
      aria-label={isTargetable ? `Assign selected crew member to ${zoneName}` : undefined}
    >
        <h4 className="shift-zone-title">{zoneName}</h4>
        <div className="badge-container" >
            {assignedWorkers.map(emp => (
                <EmployeeBadge key={emp.id} employee={emp}/>
            ))}
        </div>
    </div>
  )
}

export default ShiftZone;
