import '../App.css'

//Metrics to track KPI data surrounding, active employees, total employees, zones, unassigned zones, completedLogs, totalLogsRequired, and compliance status (i.e 'Compliant' or 'Action Required')
const MetricsBar = () => {

   const metrics = {
    activeLaborers: 18,
    totalNeeded: 22,
    complianceStatus: 'Action Required', // Options: 'Compliant' or 'Action Required'
    unassignedZones: 2,
    completedLogs: 4,
    totalLogsRequired: 5
  }
return (
  <>
  <div className="metrics-container">
    <div className="metric-card">
      <span className="metric-icon">👥</span>
      <div className="metric-data">
        <h3>Shift Attendance</h3>
        <p className="metric-value">
          {metrics.activeLaborers} <span className="metric-sub">/ {metrics.totalNeeded} Active</span>
        </p>
      </div>
    </div>

      <div className="metric-card">
        <span className="metric-icon">⚠️</span>
        <div className="metric-data">
          <h3>Zones</h3>
          <p className="metric-value">
            {metrics.unassignedZones > 0 ? `${metrics.unassignedZones} Open Zones` : '0 Conflicts'}
          </p>
        </div>
      </div>

          <div className="metric-card">
        <span className="metric-icon">🛡️</span>
        <div className="metric-data">
          <h3>Compliance</h3>
          <p className={`metric-card ${metrics.complianceStatus === 'Compliant' ? 'status-good' : 'status-alert'}`}>

            {metrics.complianceStatus === 'Compliant' ? '100% Compliant' : 'Action Required'}
          </p>
        </div>
      </div>

      <div className="metric-card">
        <span className="metric-icon"></span>
        <div className="metric-data">
          <h3>Completed Logs</h3>
          <p className="metric-value">
            {metrics.completedLogs} / {metrics.totalLogsRequired}
          </p>
        </div>
      </div>
      <br />

  </div>





  </>
    
  
)
}

export default MetricsBar