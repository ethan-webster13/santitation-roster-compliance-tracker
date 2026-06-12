import { useState } from "react";
import NavBar from "../Components/NavBar";
import employees from "../services/employees";


const Roster = () => {
    const [liveRoster, setLiveRoster] = useState(employees)

    return (
        <>
        <NavBar />
        <h3>Roster Page</h3>
        <table>
            <thead>
                <th>Employee Name</th>
                <th>Employee Role</th>
                <th>Zone</th>
                <th>Hours worked this week</th>
            </thead>
            <tbody>
                {liveRoster.map(item => 
                    <tr key={item.id}>
                        <td>{item.firstName} {item.lastName}</td>
                        <td>{item.role}</td>
                        <td>{item.zone}</td> 
                        <td>{item.hWorked}</td>
                    </tr>
                
                )}


            </tbody>
        </table>
        </>
        
    )

}

export default Roster;