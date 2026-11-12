export const ZONES = [
  { id: 'safe', name: 'Safe Zone', kind: 'safe', lat: 37.7749, lng: -122.4194, radius: 1500, description: 'Well-traveled central district' },
  { id: 'warning', name: 'Warning Zone', kind: 'warning', lat: 37.8049, lng: -122.4194, radius: 650, description: 'Use extra caution after dark' },
  { id: 'restricted', name: 'Restricted Zone', kind: 'restricted', lat: 37.7449, lng: -122.4194, radius: 550, description: 'Access is discouraged for visitors' },
]

export const distanceInMeters = (pointA, pointB) => {
  const radians = (value) => (value * Math.PI) / 180
  const earthRadius = 6371000
  const latitudeDelta = radians(pointB.lat - pointA.lat)
  const longitudeDelta = radians(pointB.lng - pointA.lng)
  const value = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(radians(pointA.lat)) * Math.cos(radians(pointB.lat)) * Math.sin(longitudeDelta / 2) ** 2
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}

export const findZone = (point) => {
  if (!point) return null
  const matches = ZONES.filter((zone) => distanceInMeters(point, zone) <= zone.radius)
  return matches.sort((a, b) => ({ restricted: 0, warning: 1, safe: 2 }[a.kind] - { restricted: 0, warning: 1, safe: 2 }[b.kind])[0] || null
}
