// src/components/LeafletMapView.jsx
import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/lib/leafletIconFix';

// Fix default icon for Vite (import images)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Optional: color icons per severity (simple example uses CSS classes or different icons).
// For now we use default icon and map Tooltip/Popup content.

function FitBounds({ incidents }) {
  const map = useMap();
  useEffect(() => {
    if (!incidents || incidents.length === 0) return;
    const bounds = L.latLngBounds(incidents.map(i => [i.location.lat, i.location.lng]));
    map.invalidateSize();
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [incidents, map]);
  return null;
}

function MapClickHandler() {
  // Save clicked coords to localStorage for your Report form to read
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      localStorage.setItem('pickedLat', lat.toString());
      localStorage.setItem('pickedLng', lng.toString());
      // optional: give quick visual feedback
      // you can dispatch a custom event or use a toast (if you have one)
      // window.dispatchEvent(new CustomEvent('picked-location', { detail: { lat, lng } }));
      alert('Location selected — go back to the report form and paste coordinates (or it may auto-pick).');
    },
  });
  return null;
}

export default function LeafletMapView({ incidents = [], activeIncidentId = null, onMarkerClick = () => {} }) {
  // Ensure incidents have { location: { lat, lng } } shape
  const validIncidents = useMemo(() => {
    return incidents
      .map(i => {
        // normalize common shapes:
        if (!i) return null;
        // if GeoJSON coordinates: { location: { type:'Point', coordinates: [lng, lat] } }
        if (i.location && Array.isArray(i.location.coordinates)) {
          return { ...i, location: { lat: i.location.coordinates[1], lng: i.location.coordinates[0] } };
        }
        // if location has lat/lng already, keep it
        if (i.location && typeof i.location.lat === 'number' && typeof i.location.lng === 'number') {
          return i;
        }
        // fallback: if top-level fields lat/lng exist
        if (typeof i.lat === 'number' && typeof i.lng === 'number') {
          return { ...i, location: { lat: i.lat, lng: i.lng } };
        }
        return null;
      })
      .filter(Boolean);
  }, [incidents]);

  // default center if no incidents
  const defaultCenter = [20.5937, 78.9629]; // India center — adjust to your audience
  const defaultZoom = 5;

  return (
    <div className="w-full h-[70vh] rounded overflow-hidden shadow">
      <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        <FitBounds incidents={validIncidents} />

        {validIncidents.map((incident) => (
          <Marker
            key={incident.id || incident._id}
            position={[incident.location.lat, incident.location.lng]}
            eventHandlers={{
              click: () => onMarkerClick(incident),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div style={{ fontWeight: 600 }}>
                {incident.title} <div style={{ fontSize: 11, opacity: 0.8 }}>{incident.severity}</div>
              </div>
            </Tooltip>
            <Popup>
              <div style={{ maxWidth: 260 }}>
                <h3 style={{ fontWeight: 700 }}>{incident.title}</h3>
                <p style={{ fontSize: 13, marginTop: 4 }}>{incident.description}</p>
                <p style={{ fontSize: 12, color: '#666', marginTop: 6 }}>{incident.location?.address || `${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}`}</p>
                {incident.images?.[0] && <img src={incident.images[0]} alt="incident" style={{ width: '100%', height: 120, objectFit: 'cover', marginTop: 8 }} />}
                <div style={{ marginTop: 8, fontSize: 12, color: '#444' }}>{new Date(incident.timestamp).toLocaleString()}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
