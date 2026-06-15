import { createContext, useContext, useState} from "react";
import initialEmployees from '../data/employees'

const RosterContext = createContext();

export const RosterProvider = ({ children }) =>{
    const [liveRoster, setLiveRoster] = useState(initialEmployees);
    const addEmployee = (newEmp) => setLiveRoster(prev => [...prev, newEmp]);
    const deleteEmployee = (id) => setLiveRoster(prev => prev.filter(emp => emp.id !== id));

  return (
    <RosterContext.Provider value={{ liveRoster, addEmployee, deleteEmployee }}>
      {children}
    </RosterContext.Provider>
  );

};

export const useRoster = () => useContext(RosterContext)