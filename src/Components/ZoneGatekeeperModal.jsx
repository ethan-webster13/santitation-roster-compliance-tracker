import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

const ZoneGatekeeperModal = ({ zoneName, onClose, onComplete }) => {
    const floorSigRef = useRef(null);
    const lotoSigRef = useRef(null);

    const [preCleanStep, setPreCleanStep] = useState(1);

    const [handoffData, setHandoffData] = useState({
        plantPersonnelName: '',
        inheritedDamage: '',
        signature: null,
        timestamp: null
    });

    const [lotoData, setLotoData] = useState({
        lockNumber: '',
        supervisorId: '',
        energyIsolated: false,
        signature: null,
        timestamp: null
    });

    const handleFloorSubmit = (e) => {
        e.preventDefault();
        if (floorSigRef.current.isEmpty()) {
            alert("Plant personnel initials or signature required for floor signoff.");
            return;
        }
        
        setHandoffData((prev) => ({
            ...prev, 
            signature: floorSigRef.current.getTrimmedCanvas().toDataURL("image/jpg"),
            timestamp: new Date().toISOString(),
        }));

        setPreCleanStep(2)
    };

    const handleLotoSubmit = (e) => {
        e.preventDefault();
        if (lotoSigRef.current.isEmpty()) {
            alert("Supervisor signature required to verify zero energy state.");
            return;
        }

        const completedLoto = {
                ...lotoData,
                signature: lotoSigRef.current.getTrimmedCanvas().toDataURL('image/jpg'),
                timestamp: new Date().toISOString(),
        };

        onComplete(zoneName, {handoff: handoffData, loto: completedLoto});


    }

    


}

export default ZoneGatekeeperModal;