import React from "react";
import IncidentMap from "./Components/Map/IncidentMap";

export default function App() {
  return (
    <div>
      <header style={{ textAlign: "center", padding: "1rem", background: "#1E3A8A", color: "white" }}>
        <h1>🌎 RescueMind Live Incident Map</h1>
        <p>Real-time disaster monitoring across regions</p>
      </header>
      <IncidentMap />
    </div>
  );
}
