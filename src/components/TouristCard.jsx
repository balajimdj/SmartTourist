export default function TouristCard({ tourist, compact = false }) {
  if (!tourist) return null
  return (
    <div className={`tourist-card ${compact ? 'compact' : ''}`}>
      <div className="id-card-top"><div className="brand-mini"><span className="brand-mark small">S</span> SAFETREK VERIFIED</div><span className="id-chip">DIGITAL ID</span></div>
      <div className="id-card-person">
        <div className="id-avatar">{tourist.name?.charAt(0).toUpperCase()}</div>
        <div><p className="eyebrow">REGISTERED TRAVELER</p><h3>{tourist.name}</h3><span>{tourist.email}</span></div>
      </div>
      <div className="id-card-bottom"><div><small>TOURIST ID</small><strong>{tourist.id}</strong></div><div><small>STATUS</small><strong className="verified-text">● Verified</strong></div></div>
    </div>
  )
}
