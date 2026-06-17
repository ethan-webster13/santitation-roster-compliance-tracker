import React from "react";

const EmployeeBadge = ({ employee }) => {

    const getRoleClass = (role) => {
        if (role === 'supevisor') return 'role-supervisor';
        if (role.includes('lead')) return 'role-lead';
        return 'role-laborer';
    };

    return (
        <div className={`employee-badge ${getRoleClass(employee.role)}`}>
            <span>{employee.firstName}</span>
            <span className="badge-role-text">{employee.role}</span>
        </div>
    )
}

export default EmployeeBadge;