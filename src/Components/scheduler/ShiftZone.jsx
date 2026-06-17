import React from "react";
import EmployeeBadge from "./EmployeeBadge";

const ShiftZone = ({ zoneName }) => {
    //temp data to test roles
    const sampleEmployees = [
    { id: 1, firstName: 'Fred', role: 'supervisor' },
    { id: 3, firstName: 'Sarah', role: 'sanitation lead' }
  ];

  return (
    <div className="shift-zone">
        <h4 className="shift-zone-title">{zoneName}</h4>
        <div className="badge-container" >
            {sampleEmployees.map(emp => (
                <EmployeeBadge key={emp.id} employee={emp}/>
            ))}
        </div>
    </div>
  )
}

export default ShiftZone;