export async function apiFetch(path: string, options: RequestInit = {}) {
  const baseUrl =
    import.meta.env.VITE_API_URL ||
    "https://gsm1y3fxp9.execute-api.us-east-1.amazonaws.com/prod";

  const res = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}
