import React from "react";

const EmployeeBadge = ({ employee }) => {
    // crash guard: If an employee is missing a role, default to 'laborer' so the app doesn't crash
    const role = employee?.role || 'laborer';

    const getRoleClass = (role) => {
        if (role === 'supevisor') return 'role-supervisor';
        if (role.includes('lead')) return 'role-lead';
        return 'role-laborer';
    };
    // This fires the exactly when the user clicks and starts dragging the badge
    const handleDragStart = (e) => {
        /* THE "BACKPACK" ANALOGY:
            Think of 'dataTransfer' like a temporary backpack the browser gives us for the trip.
            We pack the moving employee's ID into the backpack as plain text.
            When the user drops this badge later, the landing pad will open this backpack to see who arrived.
        */
        e.dataTransfer.setData("text/plain", employee.id.toString());

       // Tells the browser we want to move this card, not copy a duplicate of it
        e.dataTransfer.effectAllowed = "move";
    }

    return (
    <div 
      className={`employee-badge draggable ${getRoleClass(employee.role)}`}
      draggable="true" //Tells the browser "unlock this div and allow it to be dragged"
      onDragStart={handleDragStart}
    >
      <span>{employee.firstName} {employee.lastName[0]}.</span>
      <span className="badge-role-text">{employee.role.replace('sanitation ', '')}</span>
    </div>
  );
}

export default EmployeeBadge;