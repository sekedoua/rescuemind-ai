import { useEffect, useState } from "react";
import { getIncidents } from "../api/incidents";
import { Incident } from "../types/incident";

export const useIncidents = (intervalMs = 10000) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getIncidents();
        setIncidents(data);
      } catch (err) {
        console.error("Failed to fetch incidents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return { incidents, loading };
};
