export default function SOSButton({ onClick, compact = false }) {
  return <button className={`sos-button ${compact ? 'sos-compact' : ''}`} onClick={onClick}><span className="sos-icon">!</span><span><strong>SOS</strong>{!compact && <small>Request emergency help</small>}</span></button>
}
