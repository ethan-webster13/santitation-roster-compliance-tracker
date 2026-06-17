import React from "react";
import ShiftZone from "./ShiftZone";

const FacilityArea = ({ title, zones }) => {


    return (
        <div className="facility-area">
            <h3 className="facility-area-title">{title}</h3>
            
            <div className="shift-zone-grid">
                {zones.map((zoneName, index) => (
                    <ShiftZone key={index} zoneName={zoneName}/>
                ))}
            </div>
        </div>
    )

}

export default FacilityArea;