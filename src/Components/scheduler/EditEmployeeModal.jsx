import { useState, useEffect } from "react";
import { useRoster } from "../../context/RosterContext";
import initialLayoutData from "../../data/layoutData";

const EditEmployeeModal = ({ employeeId, onClose }) => {
    const {liveRoster, updateEmployee } = useRoster();

    const employee = liveRoster.find(emp => emp.id === employeeId);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [zone, setZone] = useState("");

    useEffect(()=> {
        if (employee) {
            setFirstName(employee.firstName);
            setLastName(employee.lastName);
            setRole(employee.role);
            setZone(employee.zone || '');
        }
    }, [employee, employeeId]);

    if (!employee) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        updateEmployee( employeeId, {
            firstName,
            lastName,
            role,
            zone
        });
        
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h3>Edit Employee Profile</h3>
                <p className="modal-subtitle">Updating information for #{employeeId}</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input 
                            type="text"
                            value={firstName}
                            onChange={(e)=> setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input 
                            type="text"
                            value={lastName}
                            onChange={(e)=>setLastName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Role / Title</label>
                        <input 
                            type="text"
                            value={role}
                            onChange={(e)=>setRole(e.target.value)}
                            placeholder="e.g. Sanitation Lead, Laborer"
                        />
                    </div>

                    <div className="form-group">
                        <label>Assigned Zone / Department</label>
                        <select 
                        className="form-select"
                        value={zone}
                        onChange={(e)=>setZone(e.target.value)}>
                            <option value="">--Unassigned (Bench)-- </option>

                            {initialLayoutData.map((area)=> (
                                <option key={area.id} value={area.title}>{area.title}</option>
                            )            
                            )}
                            </select>
                    </div>
                    
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmployeeModal;