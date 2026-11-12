import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import ProtectedLayout from './components/ProtectedLayout'
import AdminDashboard from './pages/AdminDashboard'
import Chatbot from './pages/Chatbot'
import DigitalID from './pages/DigitalID'
import Emergency from './pages/Emergency'
import Geofencing from './pages/Geofencing'
import IncidentManagement from './pages/IncidentManagement'
import LocationTracking from './pages/LocationTracking'
import Login from './pages/Login'
import Register from './pages/Register'
import TouristDashboard from './pages/TouristDashboard'
import { detectRisk } from './utils/aiDetection'
import { addIdentityBlock, verifyIdentity } from './utils/blockchain'
import { distanceInMeters, findZone } from './utils/geofencing'
import { createId, DEMO_ADMIN, initialIncidents, initialTourists, readStorage, writeStorage } from './utils/storage'

export default function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => readStorage('safetrek_session', null))
  const [tourists, setTourists] = useState(initialTourists)
  const [incidents, setIncidents] = useState(initialIncidents)
  const [sharing, setSharingState] = useState(() => readStorage('safetrek_location_sharing', false))
  const [location, setLocation] = useState(() => readStorage('safetrek_location', null))
  const [updatedAt, setUpdatedAt] = useState(() => readStorage('safetrek_location_updated', null))
  const [jumpDetectedAt, setJumpDetectedAt] = useState(null)
  const [riskClock, setRiskClock] = useState(Date.now())
  const isAdmin = user?.role === 'admin'
  const setSharing = useCallback((value) => {
    setSharingState(value)
    writeStorage('safetrek_location_sharing', value)
  }, [])

  useEffect(() => writeStorage('safetrek_tourists', tourists), [tourists])
  useEffect(() => writeStorage('safetrek_incidents', incidents), [incidents])
  useEffect(() => writeStorage('safetrek_location', location), [location])
  useEffect(() => writeStorage('safetrek_location_updated', updatedAt), [updatedAt])
  useEffect(() => {
    const timer = window.setInterval(() => setRiskClock(Date.now()), 60000)
    return () => window.clearInterval(timer)
  }, [])

  const updatePosition = useCallback((coords) => {
    const next = { lat: coords.latitude, lng: coords.longitude, accuracy: coords.accuracy }
    setLocation((previous) => {
      if (previous && distanceInMeters(previous, next) > 15000) setJumpDetectedAt(Date.now())
      return next
    })
    const time = new Date().toISOString()
    setUpdatedAt(time)
    setTourists((items) => items.map((item) => item.id === user?.id ? { ...item, location: next, locationUpdatedAt: time, sharing: true } : item))
  }, [user?.id])

  useEffect(() => {
    if (!user || isAdmin || !sharing || !navigator.geolocation) return undefined
    const watchId = navigator.geolocation.watchPosition(updatePosition, (error) => {
      console.warn('Location access was not available', error.message)
    }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 })
    return () => navigator.geolocation.clearWatch(watchId)
  }, [user, isAdmin, sharing, updatePosition])

  useEffect(() => {
    if (!user || isAdmin) return
    setTourists((items) => items.map((item) => item.id === user.id ? { ...item, sharing } : item))
  }, [user, isAdmin, sharing])

  const requestLocation = useCallback(() => new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }
    navigator.geolocation.getCurrentPosition((position) => {
      updatePosition(position.coords)
      resolve(position.coords)
    }, (error) => {
      const message = error.code === 1 ? 'Location permission was denied. Allow location access in your browser settings.' : error.code === 2 ? 'Your current position is unavailable. Try again outdoors or check your device settings.' : 'Location request timed out. Please try again.'
      reject(new Error(message))
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 })
  }), [updatePosition])

  const onLogin = async (email, password) => {
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const admin = { name: DEMO_ADMIN.name, email: DEMO_ADMIN.email, role: 'admin' }
      setUser(admin); writeStorage('safetrek_session', admin); navigate('/admin'); return
    }
    const tourist = tourists.find((item) => item.email.toLowerCase() === email && item.password === password)
    if (!tourist) throw new Error('Email or password is incorrect.')
    const publicTourist = { ...tourist, password: undefined }
    setUser(publicTourist); writeStorage('safetrek_session', publicTourist); navigate('/')
  }

  const onRegister = async (details) => {
    const email = details.email.trim().toLowerCase()
    if (tourists.some((tourist) => tourist.email.toLowerCase() === email)) throw new Error('An account with this email already exists.')
    const tourist = { ...details, name: details.name.trim(), email, phone: details.phone.trim(), id: createId('TID'), role: 'tourist', createdAt: new Date().toISOString() }
    setTourists((items) => [...items, tourist])
    const publicTourist = { ...tourist, password: undefined }
    setUser(publicTourist); writeStorage('safetrek_session', publicTourist); setSharing(true); navigate('/')
  }

  const logout = () => {
    if (user && !isAdmin) {
      setTourists((items) => items.map((item) => item.id === user.id
        ? { ...item, sharing: false, location: null, locationUpdatedAt: null }
        : item))
      setLocation(null)
      setUpdatedAt(null)
    }
    setUser(null); setSharing(false); writeStorage('safetrek_session', null); navigate('/login')
  }

  const sendSos = () => {
    if (!user || isAdmin) return
    const incident = {
      id: createId('INC'),
      touristId: user.id,
      touristName: user.name,
      time: new Date().toISOString(),
      location,
      status: 'Reported',
      note: 'Emergency assistance requested',
    }
    setIncidents((items) => [incident, ...items])
    navigate('/emergency')
  }

  const updateIncident = (incidentId, status) => {
    setIncidents((items) => items.map((item) => item.id === incidentId ? { ...item, status } : item))
  }

  const riskFor = useCallback((tourist) => {
    const recent = incidents.filter((incident) => incident.touristId === tourist.id && Date.now() - new Date(incident.time).getTime() < 24 * 60 * 60 * 1000).length
    const storedTourist = tourists.find((item) => item.id === tourist.id) || tourist
    const lastUpdate = tourist.id === user?.id ? updatedAt : storedTourist.locationUpdatedAt
    const currentlySharing = tourist.id === user?.id ? sharing : storedTourist.sharing
    const stale = Boolean(currentlySharing && (!lastUpdate || Date.now() - new Date(lastUpdate).getTime() > 10 * 60 * 1000))
    const isRestricted = findZone(tourist.id === user?.id ? location : storedTourist.location)?.kind === 'restricted'
    const jumpIsRecent = tourist.id === user?.id && jumpDetectedAt && Date.now() - jumpDetectedAt < 30 * 60 * 1000
    return detectRisk({ restricted: isRestricted, unexpectedJump: Boolean(jumpIsRecent), staleLocation: stale, recentEmergencies: recent, now: riskClock })
  }, [incidents, tourists, user?.id, updatedAt, sharing, location, jumpDetectedAt, riskClock])

  const liveTourists = tourists.filter((tourist) => tourist.sharing && tourist.location && tourist.locationUpdatedAt
    && Date.now() - new Date(tourist.locationUpdatedAt).getTime() <= 10 * 60 * 1000)
  const activeCount = liveTourists.length
  const highRiskTourists = tourists.map((tourist) => ({ tourist, risk: riskFor(tourist) })).filter(({ risk }) => risk.level === 'High')

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={isAdmin ? '/admin' : '/'} replace /> : <Login onLogin={onLogin} />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register onRegister={onRegister} />} />
      <Route element={<ProtectedLayout user={user} onLogout={logout} isAdmin={isAdmin} isSharing={sharing} onToggleSharing={() => setSharing(!sharing)} />}>
        <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <TouristDashboard user={user} location={location} sharing={sharing} risk={user ? riskFor(user) : { level: 'Low', score: 0, reasons: [] }} onSos={sendSos} tourists={tourists} />} />
        <Route path="/digital-id" element={<DigitalID user={user} isAdmin={isAdmin} tourists={tourists} verifyId={verifyIdentity} addIdToChain={addIdentityBlock} />} />
        <Route path="/location" element={isAdmin ? <Navigate to="/admin" replace /> : <LocationTracking location={location} sharing={sharing} setSharing={setSharing} requestLocation={requestLocation} updatedAt={updatedAt} tourists={tourists} />} />
        <Route path="/geofencing" element={isAdmin ? <Navigate to="/admin" replace /> : <Geofencing location={location} />} />
        <Route path="/emergency" element={isAdmin ? <Navigate to="/admin" replace /> : <Emergency user={user} location={location} onSos={sendSos} incidents={incidents} />} />
        <Route path="/chatbot" element={isAdmin ? <Navigate to="/admin" replace /> : <Chatbot />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard tourists={liveTourists} incidents={incidents} highRiskTourists={highRiskTourists} activeCount={activeCount} /> : <Navigate to="/" replace />} />
        <Route path="/incidents" element={isAdmin ? <IncidentManagement incidents={incidents} onUpdateStatus={updateIncident} /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={isAdmin ? '/admin' : '/'} replace />} />
      </Route>
    </Routes>
  )
}
