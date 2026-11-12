import { useState } from 'react'
import MapComponent from '../components/MapComponent'
import { findZone } from '../utils/geofencing'

export default function LocationTracking({ location, sharing, setSharing, requestLocation, updatedAt, tourists }) {
  const [error, setError] = useState('')
  const update = async () => {
    setError('')
    try { await requestLocation() } catch (failure) { setError(failure.message) }
  }
  const zone = findZone(location)
  return (
    <div className="page-stack"><div className="page-intro split-intro"><div><span className="eyebrow">LOCATION SERVICES</span><h2>Stay connected to your location</h2><p>Your browser asks permission before sharing GPS coordinates. You can pause sharing at any time.</p></div><button className={`button ${sharing ? 'button-secondary' : 'button-primary'}`} onClick={() => setSharing(!sharing)}>{sharing ? 'Pause location sharing' : 'Enable location sharing'}</button></div>
      {!sharing && <div className="alert-banner alert-neutral"><span>⌖</span><div><strong>Location sharing is paused</strong><p>Your position is not being updated or shared with the admin view.</p></div></div>}
      {error && <div className="form-error">{error}</div>}
      <section className="location-grid"><div className="panel map-panel"><div className="panel-heading"><div><span className="eyebrow">OPENSTREETMAP</span><h3>Current position</h3></div><button className="button button-secondary small-button" onClick={update} disabled={!sharing}>↻ Refresh GPS</button></div><MapComponent position={location} tourists={tourists} height="520px" /><div className="map-legend"><span><i className="legend-dot blue-dot" />Your location</span><span><i className="legend-dot green-dot" />Safe zone</span><span><i className="legend-dot yellow-dot" />Warning zone</span><span><i className="legend-dot red-dot" />Restricted zone</span></div></div>
        <aside className="right-stack"><div className="panel location-info"><span className="eyebrow">GPS COORDINATES</span><h3>{location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'Waiting for GPS'}</h3><div className="detail-list"><div><span>Sharing status</span><strong className={sharing ? 'verified-text' : ''}>{sharing ? '● Active' : 'Paused'}</strong></div><div><span>Last updated</span><strong>{updatedAt ? new Date(updatedAt).toLocaleTimeString() : 'Not available'}</strong></div><div><span>Safety zone</span><strong>{zone?.name || (location ? 'Outside zones' : 'Unknown')}</strong></div></div><button className="button button-primary full-button" onClick={update} disabled={!sharing}>Get my current location</button><small className="muted">GPS availability depends on your device, browser permission and connection.</small></div><div className="panel privacy-note"><span>◈</span><div><strong>Location privacy</strong><p>Coordinates stay in this browser’s local storage and are not sent to a server.</p></div></div></aside>
      </section>
    </div>
  )
}
