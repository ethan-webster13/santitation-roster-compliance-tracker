import { createContext, useContext, useState} from "react";
import initialEmployees from '../data/employees'

const RosterContext = createContext();

export const RosterProvider = ({ children }) =>{
    const [liveRoster, setLiveRoster] = useState(initialEmployees);

    /* --- STATE FOR TRACKING WHERE EMPLOYEES ARE ASSIGNED ---

 Instead of making complex arrays inside of arrays, we use one flat Object.
 The key is the Employee's ID, and the value is their location.
 Example: { "7": { areaId: "packaging", zoneName: "Labeling Lines" } }
 Why this helps us: A JavaScript object can't have duplicate keys. 
 This makes it physically impossible for an employee to be assigned to two places at once! */

    const [assignments, setAssignments] = useState({});
    
    const addEmployee = (newEmp) => setLiveRoster(prev => [...prev, newEmp]);
    const deleteEmployee = (id) => {
      setLiveRoster(prev => prev.filter(emp => emp.id !== id));
      unassignEmployee(id);
    };

    // This function handles placing a worker into a specific slot
    const assignEmployee = (empId, areaId, zoneName) => {
      setAssignments(prev=> ({
        ...prev,
        /* Using [empId] lets us target this exact worker's key.
            If they were already scheduled somewhere else, this line just overwrites it.
            Their old assignment vanishes automatically, preventing duplicate worker bugs!
         */
        [empId]: { areaId, zoneName}
      }));
    };
   // This function removes a worker from the board completely
    const unassignEmployee = (empId) => {
      setAssignments(prev => {
        const updated = {...prev};
        delete updated[empId]; // Erases their location key so they go back to the bench
        return updated;
      })
    }

  return (
    <RosterContext.Provider value={{ 
      liveRoster,
      addEmployee,
      deleteEmployee,
      assignments,
      assignEmployee,
      unassignEmployee}}>
      {children}
    </RosterContext.Provider>
  );

};

export const useRoster = () => useContext(RosterContext)