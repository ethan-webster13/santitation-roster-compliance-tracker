import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import '../css/scheduler.css'

const ZoneGatekeeperModal = ({ zoneName, onClose, onComplete, onSaveAndClose, initialData }) => {
    const floorSigRef = useRef(null);
    const lotoSigRef = useRef(null);

    const [preCleanStep, setPreCleanStep] = useState(initialData?.preCleanStep ?? 1);

    const [handoffData, setHandoffData] = useState(initialData?.handoffData ?? {
        plantPersonnelName: '',
        inheritedDamage: '',
        signature: null,
        timestamp: null
    });

    const [lotoData, setLotoData] = useState(initialData?.lotoData ?? {
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
            signature: floorSigRef.current.getCanvas().toDataURL("image/png"),
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
                signature: lotoSigRef.current.getCanvas().toDataURL('image/png'),
                timestamp: new Date().toISOString(),
        };

        onComplete(zoneName, {handoff: handoffData, loto: completedLoto});
    };

    const handleSaveAndClose = () => {
        onSaveAndClose(zoneName, { preCleanStep, handoffData, lotoData});
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card modal-card-lg">
                <h3>Zone Activation: {zoneName}</h3>
                <p className="modal-subtitle">Regulatory Compliance & Handover Checklist</p>

                {preCleanStep === 1 && (
                    <form onSubmit={handleFloorSubmit} className="form-group">
                        <h4 className="step-header">Step 1: Production Floor Handover</h4>

                        <label>Plant Personnel Name/ID:</label>
                        <input 
                            type="text"
                            required
                            value={handoffData.plantPersonnelName} 
                            onChange={(e)=> setHandoffData({ ...handoffData, plantPersonnelName: e.target.value})}
                            placeholder="Who is relinquishing the line?"
                        />

                        <label>Pre-Existing/Inherited Defects:</label>
                        <textarea 
                            value={handoffData.inheritedDamage}
                            onChange={(e)=> setHandoffData({ ...handoffData, inheritedDamage: e.target.value})}
                            placeholder="Log any mechanical issues left behind by production..."
                            rows={2}
                        />

                        <label>Plant Personnel Initials / Signature: </label>
                        <div className="sig-pad-wrapper">
                            <SignatureCanvas
                                ref={floorSigRef}
                                penColor="black"
                                canvasProps={{className: 'sig-pad'}}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn-clear-pad"
                            style={{ color: '#ef4444', opacity: 1, visibility: 'visible', textDecoration: 'underline' }}
                            onClick={()=>floorSigRef.current.clear()}>
                            Clear Pad
                        </button>
                        
                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn-save">Verify Signoff & Lock Time</button>
                        </div>
                    </form>
                )}

            {preCleanStep === 2 && (
                <form onSubmit={handleLotoSubmit} className="form-group">
                    <h4 className="step-header alert-header">Step 2: ⚠️ Step 2: Supervisor Control LOTO Verification</h4>

                    <label className="loto-checkbox-wrapper">
                        <input 
                            type="checkbox"
                            required
                            checked={lotoData.energyIsolated}
                            onChange={(e)=>setLotoData({...lotoData, energyIsolated: e.target.checked})}
                        />
                        <span>
                            I verify locks/tags are physically applied to main energy isolation points.
                        </span>
                    </label>

                    <div className="input-grid">
                        <div>
                            <label>Supervisor/Lead ID:</label>
                            <input 
                                type="text"    
                                required
                                value={lotoData.supervisorId}
                                onChange={(e)=>setLotoData({ ...lotoData, supervisorId: e.target.value})}
                                placeholder="Verifier ID"
                            />
                        </div>
                    </div>

                    <label>Authorized Supervisor/Lead Signature:</label>
                    <div className="sig-pad-wrapper">
                        <SignatureCanvas 
                            ref={lotoSigRef}
                            penColor="red"
                            canvasProps={{className: 'sig-pad'}}
                        />
                    </div>
                        <button type="button"  className="btn-clear-pad" onClick={()=> lotoSigRef.current.clear()}>
                            Clear Pad
                        </button>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={handleSaveAndClose}>
                                Save & Close
                            </button>
                            <button type="submit" className="btn-save" style={{ backgroundColor: "#ef4444" }}>
                                Authorize & Activate Line
                            </button>
                        </div>
                </form>
            )}
            </div>
        </div>
    );
};

export default ZoneGatekeeperModal;