export default function RiskIndicator({ risk }) {
  const level = risk?.level || 'Low'
  return (
    <div className={`risk-indicator risk-${level.toLowerCase()}`}>
      <div className="risk-ring"><span>{risk?.score ?? 0}</span></div>
      <div><span className="eyebrow">CURRENT RISK</span><h3>{level} risk</h3><p>{risk?.reasons?.[0] || 'No immediate risk factors detected.'}</p></div>
    </div>
  )
}
