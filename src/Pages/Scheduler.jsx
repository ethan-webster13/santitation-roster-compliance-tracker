import { useState } from "react";
import NavBar from "../Components/NavBar";
import FacilityArea from "../Components/scheduler/FacilityArea";
import initialLayoutData from "../data/layoutData";
import '../Components/scheduler/scheduler.css'

const Scheduler = () => {
    const [facilityData, setFacilityData] = useState(initialLayoutData)

    return (
        <>
            <NavBar />
        
        <div className="scheduler-container">
            <h2>Facility Shift Scheduler</h2>
            <div className="scheduler-grid">
                {facilityData.map( area => (
                    <FacilityArea
                    key={area.id} 
                    title={area.title} 
                    zones={area.zones} 
                    />
                ))}
            </div>
        </div>
        </>
    )
}

export default Scheduler;