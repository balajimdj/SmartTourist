import { NavLink } from 'react-router-dom'

const touristLinks = [
  ['/', 'Overview', '⌂'],
  ['/digital-id', 'Digital ID', '▣'],
  ['/location', 'Location tracking', '⌖'],
  ['/geofencing', 'Safety zones', '◎'],
  ['/emergency', 'Emergency SOS', '⚑'],
  ['/chatbot', 'Safety assistant', '✦'],
]

const adminLinks = [
  ['/admin', 'Admin overview', '▦'],
  ['/incidents', 'Incident management', '⚑'],
  ['/digital-id', 'Verify digital ID', '▣'],
]

export default function Sidebar({ isAdmin, onNavigate }) {
  const links = isAdmin ? adminLinks : touristLinks
  return (
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">S</span><span>SafeTrek<small>TOURIST SAFETY</small></span></div>
      <div className="nav-label">WORKSPACE</div>
      <nav className="side-nav">
        {links.map(([to, label, icon]) => (
          <NavLink key={to} to={to} end={to === '/'} onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">{icon}</span><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-note">
        <span className="note-icon">✦</span>
        <strong>Travel with confidence</strong>
        <p>Stay aware of your surroundings and keep location sharing on when you need support.</p>
      </div>
      <div className="sidebar-footer"><span className="status-dot" /> Safety services active</div>
    </aside>
  )
}
