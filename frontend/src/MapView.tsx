import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { connectWebSocket } from "./websocket";

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});

type Incident = {
  id: string;
  type: "weather" | "social" | "cluster";
  lat: number;
  lng: number;
  summary: string;
};

export default function MapView() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const ws = connectWebSocket((event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type && data.lat && data.lng) {
          setIncidents((prev) => [...prev, { id: Date.now().toString(), ...data }]);
        }
      } catch (err) {
        console.error("WebSocket parse error", err);
      }
    });
    return () => ws.close();
  }, []);

  return (
    <MapContainer center={[32.7767, -96.797]} zoom={6} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {incidents.map((inc) => (
        <Marker
          key={inc.id}
          position={[inc.lat, inc.lng]}
          icon={L.divIcon({
            className: "custom-marker",
            html:
              inc.type === "weather"
                ? "🔵"
                : inc.type === "social"
                ? "🟠"
                : "⭐",
            iconSize: [24, 24]
          })}
        >
          <Popup>
            <b>{inc.type.toUpperCase()}</b>
            <br />
            {inc.summary}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
