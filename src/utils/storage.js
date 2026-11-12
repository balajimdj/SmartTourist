export const readStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch (error) {
    console.error(`Unable to read ${key} from localStorage`, error)
    return fallback
  }
}

export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Unable to save ${key} to localStorage`, error)
  }
}

export const createId = (prefix) => {
  const token = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  return `${prefix}-${token}`
}

export const DEMO_ADMIN = { name: 'Safety Administrator', email: 'admin@safety.demo', password: 'admin123', role: 'admin' }
export const DEMO_TOURIST = {
  id: 'TID-DEMO-2048',
  name: 'Alex Morgan',
  email: 'tourist@safety.demo',
  phone: '+1 (415) 555-0182',
  password: 'tourist123',
  role: 'tourist',
  createdAt: '2025-03-11T09:00:00.000Z',
}

export const initialTourists = () => {
  const existing = readStorage('safetrek_tourists', null)
  if (existing) return existing
  const seed = [DEMO_TOURIST]
  writeStorage('safetrek_tourists', seed)
  return seed
}

export const initialIncidents = () => {
  const existing = readStorage('safetrek_incidents', null)
  if (existing) return existing
  const seed = [{
    id: 'INC-DEMO-001',
    touristId: DEMO_TOURIST.id,
    touristName: DEMO_TOURIST.name,
    time: new Date().toISOString(),
    location: { lat: 37.7749, lng: -122.4194 },
    status: 'Verified',
    note: 'Sample incident for dashboard demonstration',
    demo: true,
  }]
  writeStorage('safetrek_incidents', seed)
  return seed
}
