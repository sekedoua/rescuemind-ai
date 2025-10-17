import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useIncidents } from "../../hooks/useIncidents";

const icons = {
  active: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
    iconSize: [30, 30],
  }),
  contained: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    iconSize: [28, 28],
  }),
  default: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    iconSize: [25, 25],
  }),
};

export default function IncidentMap() {
  const { incidents, loading } = useIncidents();

  if (loading) return <p style={{ textAlign: "center" }}>Loading map...</p>;

return (
  <div style={{ height: "100vh", width: "100vw" }}>
    <MapContainer
      center={[25.7617, -80.1918]}
      zoom={6}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {incidents.map((incident) => (
        <Marker
          key={incident.incidentId}
          position={[incident.latitude, incident.longitude]}
          icon={incidentIcon}
        >
          <Popup>
            <strong>{incident.type}</strong> — {incident.city}
            <br />
            Status: {incident.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
);

}
