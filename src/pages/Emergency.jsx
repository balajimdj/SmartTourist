import MapComponent from '../components/MapComponent'
import SOSButton from '../components/SOSButton'

export default function Emergency({ user, location, onSos, incidents }) {
  const mine = incidents.filter((incident) => incident.touristId === user.id)
  return (
    <div className="page-stack"><div className="page-intro"><div><span className="eyebrow">HELP IS A TAP AWAY</span><h2>Emergency assistance</h2><p>Use SOS to create an alert on this device. In a real emergency, contact local emergency services directly.</p></div></div>
      <section className="emergency-hero"><div className="emergency-copy"><span className="eyebrow">NEED IMMEDIATE HELP?</span><h2>Send an SOS alert</h2><p>This saves your Tourist ID, the time, and your most recent GPS position for the admin demonstration view.</p><SOSButton onClick={onSos} /></div><div className="emergency-map">{location ? <MapComponent position={location} showZones={false} height="230px" /> : <div className="no-location"><span>⌖</span><strong>GPS position unavailable</strong><small>Your alert can still be created without coordinates.</small></div>}</div></section>
      <section className="panel incidents-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR ALERT HISTORY</span><h3>Recent SOS alerts</h3></div><span className="count-badge">{mine.length}</span></div>{mine.length === 0 ? <div className="empty-state">No SOS alerts have been created.</div> : <div className="incident-list">{mine.map((incident) => <div className="incident-row" key={incident.id}><span className="incident-mark">!</span><div className="incident-main"><strong>{incident.note || 'Emergency assistance requested'}</strong><small>{new Date(incident.time).toLocaleString()} · {incident.location ? `${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}` : 'No GPS coordinates'}</small></div><span className={`status-tag status-${incident.status.toLowerCase()}`}>{incident.status}</span></div>)}</div>}</section>
    </div>
  )
}
