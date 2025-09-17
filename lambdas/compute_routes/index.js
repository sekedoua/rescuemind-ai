/* eslint-disable no-console */
exports.handler = async (event = {}) => {
  console.log("ComputeRoutesFn invoked:", JSON.stringify(event));

  // Accept either { candidates: [...] } or { incidents: [...] }
  const candidates = event.candidates || event.incidents || [];

  // If objects have a status, only route READY ones; otherwise include all
  const ready = candidates.filter(c => c.status ? c.status === "READY" : true);

  // Build simple dummy routes for tests; shape is predictable
  const routes = ready.map((c, i) => ({
    id: c.id ?? `route-${i + 1}`,
    from: c.from ?? c.origin ?? null,
    to: c.to ?? c.destination ?? null,
    waypoints: c.waypoints ?? [],
    etaMinutes: 15 + i,        // stub values to make assertions easy
    distanceKm: 3.2 + i * 0.5, // stub values
    confidence: 0.8
  }));

  return { routes };
};
