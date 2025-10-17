import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


const getMarkerColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "red";
    case "warning":
      return "orange";
    case "contained":
      return "green";
    case "resolved":
      return "blue";
    default:
      return "gray";
  }
};

const createMarkerIcon = (color: string) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  
const blueIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Incident {
  incidentId: string;
  type: string;
  city: string;
  latitude: number;
  longitude: number;
  status: string;
}

const API_URL =
  "https://tj3yov0q6h.execute-api.us-east-1.amazonaws.com/prod/mapdata";

const SUMMARIZE_URL =
  "https://tj3yov0q6h.execute-api.us-east-1.amazonaws.com/prod/summarize";

// Auto-zoom component
const FitBounds: React.FC<{ incidents: Incident[] }> = ({ incidents }) => {
  const map = useMap();

  useEffect(() => {
    if (incidents.length === 0) return;
    const bounds = L.latLngBounds(
      incidents.map((i) => [i.latitude, i.longitude])
    );
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [incidents, map]);

  return null;
};

const IncidentMap: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<Record<string, string>>(
    {}
  );

  // Fetch all incidents
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to load incidents");
        const data = await response.json();
        if (Array.isArray(data.items)) {
          setIncidents(data.items);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err: any) {
        console.error("Error fetching incidents:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
	
	const legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    const div = L.DomUtil.create("div", "info legend");
    const statuses = ["active", "warning", "contained", "resolved"];
    const colors = ["red", "orange", "green", "blue"];
    let html = "<strong>Status Legend</strong><br/>";
    statuses.forEach((s, i) => {
      html += `<i style="background:${colors[i]};width:12px;height:12px;display:inline-block;margin-right:5px;"></i>${s}<br/>`;
    });
    div.innerHTML = html;
    return div;
  };
  }, []);
  
  

  // Summarize incident when clicked
  const handleSummarize = async (incident: Incident) => {
    try {
      const text = `${incident.type} alert in ${incident.city}. Status: ${incident.status}.`;
      const response = await fetch(SUMMARIZE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (data.summary) {
        setSelectedSummary((prev) => ({
          ...prev,
          [incident.incidentId]: data.summary,
        }));
      } else {
        setSelectedSummary((prev) => ({
          ...prev,
          [incident.incidentId]: "No summary available.",
        }));
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSelectedSummary((prev) => ({
        ...prev,
        [incident.incidentId]: "Failed to fetch summary.",
      }));
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading incidents...</p>}

      <MapContainer
        center={[37.0902, -95.7129]} // Center of USA
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <FitBounds incidents={incidents} />

        {incidents.map((incident) => (
          <Marker
            key={incident.incidentId}
            position={[incident.latitude, incident.longitude]}
            icon={createMarkerIcon(getMarkerColor(incident.status))}
            eventHandlers={{
              click: () => handleSummarize(incident),
            }}
          >
            <Popup>
              <strong>{incident.type.toUpperCase()}</strong>
              <br />
              {incident.city}
              <br />
              Status: {incident.status}
              <hr />
              {selectedSummary[incident.incidentId] ? (
                <div
                  style={{
                    whiteSpace: "pre-line",
                    maxWidth: "400px",
					minWidth:"250px",
                    fontSize: "0.9rem",
					maxHeight: "300px", 
					overflowY: "auto", 
					paddingRight: "8px" 
                  }}
                >
                  {selectedSummary[incident.incidentId]}
                </div>
              ) : (
                <em>Click marker to summarize 🚀</em>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IncidentMap;
