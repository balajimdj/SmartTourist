import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function ProtectedLayout({ user, onLogout, isAdmin, isSharing, onToggleSharing }) {
  const [menuOpen, setMenuOpen] = useState(false)
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="app-shell">
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">☰</button>
      <div className={menuOpen ? 'sidebar-wrap open' : 'sidebar-wrap'}><Sidebar isAdmin={isAdmin} onNavigate={() => setMenuOpen(false)} /></div>
      {menuOpen && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <main className="main-area">
        <Navbar user={user} onLogout={onLogout} isAdmin={isAdmin} isSharing={isSharing} onToggleSharing={onToggleSharing} />
        <div className="page-content"><Outlet /></div>
        <footer className="app-footer">SafeTrek is a learning demonstration. Always contact local emergency services in a real emergency.</footer>
      </main>
    </div>
  )
}
