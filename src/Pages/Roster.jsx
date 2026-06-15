import { useState } from "react";
import NavBar from "../Components/NavBar";
import employees from "../data/employees";
import { useAuth, useRole } from "../Components/AuthContext";

const Roster = () => {
  const [liveRoster, setLiveRoster] = useState(employees);
  const { user } = useAuth();
  const { isManager, isSupervisor } = useRole();

  return (
    <>
      <NavBar />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3>Roster Page</h3>
        {/* Only managers see this button — supervisors and read-only do not */}
        {isManager && (
          <button onClick={() => console.log("Add employee clicked")}>
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
            <th>Employee Name</th>
            <th>Employee Role</th>
            <th>Zone</th>
            <th>Hours this week</th>
            {/* Actions column only renders for manager or supervisor */}
            {(isManager || isSupervisor) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {liveRoster.map((item) => (
            <tr key={item.id}>
              <td>{item.firstName} {item.lastName}</td>
              <td>{item.role}</td>
              <td>{item.zone}</td>
              <td>{item.hWorked}</td>
              {(isManager || isSupervisor) && (
                <td>
                  {/* Manager can edit AND remove; supervisor can only edit */}
                  <button onClick={() => console.log("Edit", item.id)}>Edit</button>
                  {isManager && (
                    <button onClick={() => console.log("Remove", item.id)}>
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