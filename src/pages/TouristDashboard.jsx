import { Link } from 'react-router-dom'
import MapComponent from '../components/MapComponent'
import RiskIndicator from '../components/RiskIndicator'
import SOSButton from '../components/SOSButton'
import TouristCard from '../components/TouristCard'
import { findZone } from '../utils/geofencing'

export default function TouristDashboard({ user, location, sharing, risk, onSos, tourists }) {
  const zone = findZone(location)
  return (
    <div className="page-stack">
      <section className="welcome-row"><div><span className="eyebrow">YOUR TRAVEL SAFETY AT A GLANCE</span><h2>Good day, {user.name.split(' ')[0]} <span className="wave">✦</span></h2><p>Keep exploring. Your safety tools are ready when you need them.</p></div><SOSButton onClick={onSos} compact /></section>
      <section className="stat-grid three">
        <article className="stat-card"><span className="stat-icon blue">⌖</span><div><span>LOCATION SHARING</span><strong>{sharing ? 'Active' : 'Paused'}</strong><small>{location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'No GPS position yet'}</small></div></article>
        <article className="stat-card"><span className={`stat-icon ${zone?.kind === 'restricted' ? 'red' : zone?.kind === 'warning' ? 'yellow' : 'green'}`}>◎</span><div><span>SAFETY ZONE</span><strong>{zone?.name || 'Outside zones'}</strong><small>{zone?.description || 'No active zone alert'}</small></div></article>
        <article className="stat-card"><span className="stat-icon violet">✦</span><div><span>SAFETY RISK</span><strong>{risk.level} · {risk.score}/100</strong><small>Rule-based safety signals</small></div></article>
      </section>
      {(zone?.kind === 'restricted' || zone?.kind === 'warning' || risk.level !== 'Low') && <div className={`alert-banner ${zone?.kind === 'restricted' || risk.level === 'High' ? 'alert-danger' : 'alert-warning'}`}><span>!</span><div><strong>{zone?.kind === 'restricted' ? 'Restricted zone alert' : zone?.kind === 'warning' ? 'Caution in this area' : `${risk.level} safety risk detected`}</strong><p>{zone?.kind === 'restricted' ? 'Move to a safer area if possible. Your location is within a restricted demo zone.' : risk.reasons[0] || zone?.description}</p></div></div>}
      <section className="dashboard-grid">
        <div className="panel map-panel"><div className="panel-heading"><div><span className="eyebrow">LIVE SITUATION</span><h3>Your safety map</h3></div><Link to="/location" className="text-link">View map →</Link></div><MapComponent position={location} tourists={tourists.filter((item) => item.id === user.id && item.location)} height="320px" /><div className="map-legend"><span><i className="legend-dot green-dot" />Safe</span><span><i className="legend-dot yellow-dot" />Warning</span><span><i className="legend-dot red-dot" />Restricted</span></div></div>
        <div className="right-stack"><div className="panel risk-panel"><div className="panel-heading"><div><span className="eyebrow">SMART SAFETY CHECK</span><h3>Risk assessment</h3></div><span className="tiny-ai">RULE-BASED</span></div><RiskIndicator risk={risk} /><p className="method-note">{risk.explanation}</p></div><div className="panel id-summary"><div className="panel-heading"><div><span className="eyebrow">TRAVELER PROFILE</span><h3>Your digital ID</h3></div><Link to="/digital-id" className="text-link">Details →</Link></div><TouristCard tourist={user} compact /></div></div>
      </section>
      <section className="quick-links"><Link to="/geofencing"><span>◎</span><div><strong>Understand safety zones</strong><small>See nearby areas and zone guidance</small></div><b>→</b></Link><Link to="/chatbot"><span>✦</span><div><strong>Ask the safety assistant</strong><small>Quick guidance for common situations</small></div><b>→</b></Link></section>
    </div>
  )
}
