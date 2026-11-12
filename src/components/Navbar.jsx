import { useLocation } from 'react-router-dom'

const titles = {
  '/': 'Tourist overview',
  '/digital-id': 'Digital tourist ID',
  '/location': 'Location monitoring',
  '/geofencing': 'Geofencing & safety zones',
  '/emergency': 'Emergency assistance',
  '/chatbot': 'Safety assistant',
  '/admin': 'Admin overview',
  '/incidents': 'Incident management',
}

export default function Navbar({ user, onLogout, isAdmin, isSharing, onToggleSharing }) {
  const location = useLocation()
  return (
    <header className="topbar">
      <div><p className="eyebrow">SAFETY CENTER / {isAdmin ? 'ADMIN' : 'TRAVELER'}</p><h1>{titles[location.pathname] || 'Safety center'}</h1></div>
      <div className="topbar-actions">
        {!isAdmin && <button className={`share-pill ${isSharing ? 'sharing' : ''}`} onClick={onToggleSharing}><span className="status-dot" /> Location {isSharing ? 'on' : 'off'}</button>}
        <div className="user-chip"><span className="avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</span><div><strong>{user?.name}</strong><small>{isAdmin ? 'Administrator' : 'Traveler'}</small></div></div>
        <button className="logout-button" onClick={onLogout} aria-label="Log out">↗</button>
      </div>
    </header>
  )
}
