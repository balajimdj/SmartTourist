import MapComponent from '../components/MapComponent'
import { ZONES, findZone } from '../utils/geofencing'

const zoneIcons = { safe: '✓', warning: '!', restricted: '×' }

export default function Geofencing({ location }) {
  const currentZone = findZone(location)
  return (
    <div className="page-stack"><div className="page-intro"><div><span className="eyebrow">BOUNDARY AWARENESS</span><h2>Know your surroundings</h2><p>These example zones demonstrate location-based alerts. Boundaries are illustrative, not official guidance.</p></div></div>
      {currentZone && <div className={`alert-banner ${currentZone.kind === 'restricted' ? 'alert-danger' : currentZone.kind === 'warning' ? 'alert-warning' : 'alert-success'}`}><span>{zoneIcons[currentZone.kind]}</span><div><strong>Currently in: {currentZone.name}</strong><p>{currentZone.description}</p></div></div>}
      <section className="panel map-panel geofence-map"><div className="panel-heading"><div><span className="eyebrow">ZONE OVERVIEW</span><h3>Demo safety map</h3></div><span className="map-status"><i className="legend-dot blue-dot" /> {location ? 'GPS position active' : 'Showing sample area'}</span></div><MapComponent position={location} height="480px" /><div className="map-legend"><span><i className="legend-dot green-dot" />Safe</span><span><i className="legend-dot yellow-dot" />Warning</span><span><i className="legend-dot red-dot" />Restricted</span></div></section>
      <section className="zone-grid">{ZONES.map((zone) => <article key={zone.id} className={`zone-card zone-${zone.kind}`}><span className="zone-symbol">{zoneIcons[zone.kind]}</span><div><span className="eyebrow">{zone.kind.toUpperCase()} AREA</span><h3>{zone.name}</h3><p>{zone.description}</p><small>Approx. radius: {zone.radius} m</small></div></article>)}</section>
      <p className="method-note">Alerts use a simple distance check against the example circles and run in your browser. This map is not an authoritative source of danger or official restricted areas.</p>
    </div>
  )
}
