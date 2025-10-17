import { apiFetch } from "./client";
import { Incident } from "../types/incident";

export async function getIncidents(): Promise<Incident[]> {
  const data = await apiFetch("/mapdata");
  return data.items || [];
}
