import { useEffect } from 'react'
import { Circle, CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { ZONES } from '../utils/geofencing'

const zoneColors = { safe: '#24a77a', warning: '#e6a51a', restricted: '#df5260' }

function MapUpdater({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView([position.lat, position.lng], Math.max(map.getZoom(), 12), { animate: true })
  }, [map, position?.lat, position?.lng])
  return null
}

export default function MapComponent({ position, tourists = [], height = '420px', showZones = true }) {
  const center = position ? [position.lat, position.lng] : [37.7749, -122.4194]
  return (
    <div className="map-frame" style={{ height }}>
      <MapContainer center={center} zoom={12} scrollWheelZoom className="leaflet-map">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater position={position} />
        {showZones && ZONES.map((zone) => (
          <Circle key={zone.id} center={[zone.lat, zone.lng]} radius={zone.radius} pathOptions={{ color: zoneColors[zone.kind], fillColor: zoneColors[zone.kind], fillOpacity: 0.13, weight: 2 }}>
            <Tooltip>{zone.name} · {zone.description}</Tooltip>
          </Circle>
        ))}
        {position && <CircleMarker center={[position.lat, position.lng]} radius={9} pathOptions={{ color: '#fff', weight: 3, fillColor: '#367cf5', fillOpacity: 1 }}><Tooltip>You are here</Tooltip></CircleMarker>}
        {tourists.filter((tourist) => tourist.location).map((tourist) => (
          <CircleMarker key={tourist.id} center={[tourist.location.lat, tourist.location.lng]} radius={7} pathOptions={{ color: '#fff', weight: 2, fillColor: '#367cf5', fillOpacity: 0.9 }}>
            <Tooltip>{tourist.name} · {tourist.id}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
