const statuses = ['Reported', 'Verified', 'Responding', 'Resolved']

export default function IncidentManagement({ incidents, onUpdateStatus }) {
  return (
    <div className="page-stack"><div className="page-intro"><div><span className="eyebrow">RESPONSE WORKFLOW</span><h2>Incident management</h2><p>Review SOS incidents saved in this browser and update their demonstration status.</p></div></div>
      <section className="panel incidents-panel"><div className="panel-heading"><div><span className="eyebrow">INCIDENT QUEUE</span><h3>All emergency alerts</h3></div><span className="count-badge">{incidents.length}</span></div>{incidents.length === 0 ? <div className="empty-state">No incidents reported yet. SOS alerts will appear here.</div> : <div className="incident-table-wrap"><table className="incident-table"><thead><tr><th>Traveler</th><th>Incident</th><th>Time</th><th>Location</th><th>Status</th></tr></thead><tbody>{incidents.map((incident) => <tr key={incident.id}><td><strong>{incident.touristName}</strong><small>{incident.touristId}</small>{incident.demo && <small className="demo-label">DEMO SAMPLE</small>}</td><td>{incident.note || 'Emergency assistance requested'}<small>{incident.id}</small></td><td>{new Date(incident.time).toLocaleString()}</td><td>{incident.location ? <>{incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</> : 'Unavailable'}</td><td><select className={`status-select status-${incident.status.toLowerCase()}`} aria-label={`Update status for ${incident.id}`} value={incident.status} onChange={(event) => onUpdateStatus(incident.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>}</section>
      <p className="method-note">Changes are saved to localStorage on this device. This is not a real emergency dispatch system.</p>
    </div>
  )
}
