import { createContext, useContext, useState, useMemo} from "react";
import initialEmployees from '../data/employees'
import initialLayoutData from "../data/layoutData";

const RosterContext = createContext();

export const RosterProvider = ({ children }) =>{
    
  //Employee Context Data
  
  const [liveRoster, setLiveRoster] = useState(initialEmployees);
  
  /* --- STATE FOR TRACKING WHERE EMPLOYEES ARE ASSIGNED ---
  
  Instead of making complex arrays inside of arrays, we use one flat Object.
  The key is the Employee's ID, and the value is their location.
  Example: { "7": { areaId: "packaging", zoneName: "Labeling Lines" } }
  Why this helps us: A JavaScript object can't have duplicate keys. 
  This makes it physically impossible for an employee to be assigned to two places at once! */
  const [assignments, setAssignments] = useState({});
  
  // This function removes a worker from the board completely
      const unassignEmployee = (empId) => {
        setAssignments(prev => {
          const updated = {...prev};
          delete updated[empId]; // Erases their location key so they go back to the bench
          return updated;
        })
      };

  // This function handles placing a worker into a specific slot
    const assignEmployee = (empId, areaId, zoneName) => {
      setAssignments(prev=> ({
        ...prev,
        [empId]: { areaId, zoneName}
        /* Using [empId] lets us target this exact worker's key.
            If they were already scheduled somewhere else, this line just overwrites it.
            Their old assignment vanishes automatically, preventing duplicate worker bugs! */
      }));
    };

  const clearBoard = () => {
    setAssignments({}); // Resets the coordinate map instantly to empty
  };

  const autoAssignWorkers = () => {
    setAssignments(prev => {
      // 1. Start with a copy of current assignments so we don't overwrite manual placements
      const updatedAssignments = { ...prev };

      // 2. Gather all employees who are PRESENT and NOT YET ASSIGNED
      const availableWorkers = liveRoster.filter(emp => 
        !emp.isAbsent && !updatedAssignments[emp.id]
      );

      // If everyone is already assigned or absent, change nothing
      if (availableWorkers.length === 0) return prev;

      let workerIndex = 0;

      // 3. Loop through every area and nested zone in the facility layout blueprint
      for (const area of facilityData) {
        for (const zoneName of area.zones) {
          // If we run out of unassigned workers, stop looping immediately
          if (workerIndex >= availableWorkers.length) break;

          // 4. Check if this specific zone already has someone assigned to it
          const isZoneOccupied = Object.values(updatedAssignments).some(
            assign => assign.areaId === area.id && assign.zoneName === zoneName
          );

          // 5. If the zone is completely empty, slot the next worker in!
          if (!isZoneOccupied) {
            const currentWorker = availableWorkers[workerIndex];
            
            updatedAssignments[currentWorker.id] = {
              areaId: area.id,
              zoneName: zoneName
            };

            workerIndex++; // Move to the next worker in our available pool
          }
        }
        if (workerIndex >= availableWorkers.length) break;
      }

      return updatedAssignments; // Update the global assignments state object
    });
  };


    
  const totalEmployees = useMemo(()=> {
    return liveRoster.length;
  }, [liveRoster]);

   
  const activeEmployees = useMemo(()=> {
    return liveRoster.filter(emp=> !emp.isAbsent).length;
  }, [liveRoster]);

  const addEmployee = (newEmp) => setLiveRoster(prev => [...prev, newEmp]);

  const deleteEmployee = (id) => {
    setLiveRoster(prev => prev.filter(emp => emp.id !== id));
    unassignEmployee(id);
  };

  const toggleAbsence = (empId) => {
    const targetEmployee = liveRoster.find(emp => emp.id ===empId);
    if (targetEmployee && !targetEmployee.isAbsent) {
      unassignEmployee(empId);
    }
    setLiveRoster(prevRoster=>
      prevRoster.map(emp =>
        emp.id === empId ? {...emp, isAbsent: !emp.isAbsent } : emp
      )
    )
  };
          


  //Facility Context Data
  const [facilityData, setFacilityData] = useState(initialLayoutData);
  
    const totalRequiredZones = useMemo(()=> {
        return facilityData.reduce((acc, area) => acc + area.zones.length, 0);
      }, [facilityData]);

      const filledZonesCount = useMemo(()=> {
        return facilityData.reduce((acc, area)=> {
          const filledInArea = area.zones.filter(zoneName  => 
            Object.values(assignments).some(assign => assign.areaId === area.id && assign.zoneName === zoneName)
          ).length;
          return acc + filledInArea;
        }, 0);
      }, [facilityData, assignments]);


  return (
    <RosterContext.Provider value={{ 
      liveRoster,
      addEmployee,
      deleteEmployee,
      totalRequiredZones,
      totalEmployees,
      activeEmployees,
      filledZonesCount,
      assignments,
      assignEmployee,
      unassignEmployee,
      toggleAbsence,
      autoAssignWorkers,
      clearBoard
      }}>
      {children}
    </RosterContext.Provider>
  );

};

export const useRoster = () => useContext(RosterContext)