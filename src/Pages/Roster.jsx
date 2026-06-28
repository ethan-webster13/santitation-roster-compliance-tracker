import NavBar from "../Components/NavBar";
import NewEmp from "./NewEmp";
import '../css/roster.css'
import { useAuth, useRole } from "../Components/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useRoster } from "../context/RosterContext";
import EditEmployeeModal from "../Components/EditEmployeeModal";
import { useState } from "react";

const Roster = () => {
  const { user } = useAuth();
  const { isManager, isSupervisor } = useRole();
  const navigate = useNavigate();

  const { liveRoster, deleteEmployee, toggleAbsence, updateEmployee } = useRoster();
  const [editId, setEditId] = useState(null)


  return (
    <>
      <NavBar />

      {editId && 
      <EditEmployeeModal 
      employeeId={editId} 
      onClose={()=>setEditId(null)}
      />}


      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3>Roster Page</h3>
        {/* Only managers see this button — supervisors and read-only do not */}
        {isManager && (
          <button onClick={()=>navigate('/addnewEmp')}>
            + Add Employee
          </button>
        )}
      </div>

      {/* Show who is viewing for debugging purposes*/}
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
         Viewing as: {user?.username} ({user?.role})
      </p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th> Role</th>
            <th>Zone</th>
            {/* Actions column only renders for manager or supervisor */}
            {(isManager || isSupervisor) && <th>Actions / Attendance</th>}
          </tr>
        </thead>
        <tbody>
          {liveRoster && liveRoster.map((worker) => (
            <tr key={worker.id}>
              <td>{worker.id}</td>
              <td>{worker.firstName} {worker.lastName}</td>
              <td>{worker.role}</td>
              <td>{worker.zone}</td>
              {(isManager || isSupervisor) && (
                <td>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={worker.isAbsent || false}
                      onChange={()=>toggleAbsence(worker.id)}
                    />
                    <span style={{marginRight: '2vw'}}>Mark Absent</span>
                  </label>
                  <button onClick={()=>setEditId(worker.id)}>Edit</button>
                  {isManager && (
                    <button onClick={()=>deleteEmployee(worker.id)}>
                      Remove
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Roster;