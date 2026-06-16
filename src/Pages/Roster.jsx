import NavBar from "../Components/NavBar";
import NewEmp from "./NewEmp";
import { useAuth, useRole } from "../Components/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useRoster } from "../context/RosterContext";

const Roster = () => {
  const { user } = useAuth();
  const { isManager, isSupervisor } = useRole();
  const navigate = useNavigate();

  const { liveRoster, deleteEmployee } = useRoster();
  console.log("Current Context Data:", liveRoster)


  return (
    <>
      <NavBar />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3>Roster Page</h3>
        {/* Only managers see this button — supervisors and read-only do not */}
        {isManager && (
          <button onClick={()=>navigate('/addnewEmp')}>
            + Add Employee
          </button>
        )}
      </div>

      {/* Show who is viewing — useful for debugging and impresses interviewers */}
      <p style={{ fontSize: "0.85rem", color: "#666" }}>
        Viewing as: {user?.username} ({user?.role})
      </p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th> Role</th>
            <th>Zone</th>
            <th>Hours this week</th>
            {/* Actions column only renders for manager or supervisor */}
            {(isManager || isSupervisor) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {liveRoster && liveRoster.map((worker) => (
            <tr key={worker.id}>
              <td>{worker.id}</td>
              <td>{worker.firstName} {worker.lastName}</td>
              <td>{worker.role}</td>
              <td>{worker.zone}</td>
              <td>{worker.hWorked}</td>
              {(isManager || isSupervisor) && (
                <td>
                  <button onClick={() => console.log("Edit", worker.id)}>Edit</button>
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