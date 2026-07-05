import { useRoster } from '../context/RosterContext'
import initialLayoutData from '../data/layoutData'

//Metrics to track KPI data surrounding, active employees, total employees, zones, unassigned zones, completedLogs, totalLogsRequired, and compliance status (i.e 'Compliant' or 'Action Required')
const MetricsBar = () => {
  const { 
    filledZonesCount,
    totalRequiredZones,
    totalEmployees,
    activeEmployees,
    handoffOnlyCount,
    lotoCompletedCount, 
    inspectionsPassingCount,
    releasedToProductionCount,
    totalAreas
  } = useRoster();

  const reachedHandoff = handoffOnlyCount + lotoCompletedCount;
  const reachedLoto = lotoCompletedCount;
  const reachedPassing = inspectionsPassingCount;
  const reachedReleased = releasedToProductionCount;

  const isFullyCompliant = totalAreas > 0 && reachedReleased === totalAreas;

  const stages = [
    { label: "Handoff", icon: "📝", count: reachedHandoff },
    { label: "LOTO", icon: "🔒", count: reachedLoto },
    { label: "Inspections Passing", icon: "✅", count: reachedPassing },
    { label: "Released", icon: "🚚", count: reachedReleased },
  ];


return (
    <>
      <div className="metrics-container">

        <div className="metric-card">
          <span className="metric-icon">👥</span>
          <div className="metric-data">
            <h3>Shift Attendance</h3>
            <p className="metric-value">
              {activeEmployees} <span className="metric-sub">/ {totalEmployees} Active</span>
            </p>
          </div>
        </div>

        <div className="metric-card">
          <span className="metric-icon">📍</span>
          <div className="metric-data">
            <h3>Zones</h3>
            <p className="metric-value">
              {filledZonesCount} <span className="metric-sub">/ {totalRequiredZones}</span>
            </p>
          </div>
        </div>

        <div className="metric-card">
          <span className="metric-icon">{isFullyCompliant ? "🛡️" : "⚠️"}</span>
          <div className="metric-data">
            <h3>Compliance</h3>
            <p className={`metric-status ${isFullyCompliant ? 'status-good' : 'status-alert'}`}>
              {isFullyCompliant ? '100% Compliant' : 'Action Required'}
            </p>
          </div>
        </div>

      </div>

      <div className="pipeline-stepper">
        {stages.map((stage, i) => {
          const isComplete = totalAreas > 0 && stage.count === totalAreas;
          return (
            <div className="pipeline-stage-wrap" key={stage.label}>
              <div className={`pipeline-stage ${isComplete ? 'stage-complete' : ''}`}>
                <span className="pipeline-icon">{stage.icon}</span>
                <div className="pipeline-stage-text">
                  <span className="pipeline-stage-label">{stage.label}</span>
                  <span className="pipeline-stage-value">{stage.count} / {totalAreas}</span>
                </div>
              </div>
              {i < stages.length - 1 && <div className="pipeline-connector" />}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default MetricsBar