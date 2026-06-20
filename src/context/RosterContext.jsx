import { createContext, useContext, useState, useMemo} from "react";
import initialEmployees from '../data/employees'
import initialLayoutData from "../data/layoutData";

const RosterContext = createContext();

export const RosterProvider = ({ children }) =>{
    
  //Employee Context Data
  
  const [liveRoster, setLiveRoster] = useState(initialEmployees);
  
  const totalEmployees = useMemo(()=> {
    return liveRoster.length
  })
  const activeEmployees = useMemo(()=> {

  })
  const addEmployee = (newEmp) => setLiveRoster(prev => [...prev, newEmp]);
      const deleteEmployee = (id) => {
        setLiveRoster(prev => prev.filter(emp => emp.id !== id));
        unassignEmployee(id);
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

    // This function removes a worker from the board completely
      const unassignEmployee = (empId) => {
        setAssignments(prev => {
          const updated = {...prev};
          delete updated[empId]; // Erases their location key so they go back to the bench
          return updated;
        })
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
         /* --- STATE FOR TRACKING WHERE EMPLOYEES ARE ASSIGNED ---

 Instead of making complex arrays inside of arrays, we use one flat Object.
 The key is the Employee's ID, and the value is their location.
 Example: { "7": { areaId: "packaging", zoneName: "Labeling Lines" } }
 Why this helps us: A JavaScript object can't have duplicate keys. 
 This makes it physically impossible for an employee to be assigned to two places at once! */
    const [assignments, setAssignments] = useState({});


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
      filledZonesCount,
      assignments,
      assignEmployee,
      unassignEmployee,
      toggleAbsence
      }}>
      {children}
    </RosterContext.Provider>
  );

};

export const useRoster = () => useContext(RosterContext)