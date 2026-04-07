import type { Env, NearestResponse } from "./types";
import { fetchNearestStops, fetchDepartures } from "./tfl";

const DEFAULT_STOP_TYPES = "NaptanMetroStation,NaptanRailStation";
const DEFAULT_MODES = "tube,dlr,overground,elizabeth-line,bus";
const DEFAULT_RADIUS = "2000";
const MAX_STOPS = 6;
const MAX_DEPARTURES_PER_STOP = 25;

const CORS_HEADERS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/nearest") {
      return json({ error: "Not found" }, 404);
    }

    const lat = parseFloat(url.searchParams.get("lat") ?? "");
    const lng = parseFloat(url.searchParams.get("lng") ?? "");
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return json({ error: "lat and lng query params are required" }, 400);
    }

    if (!env.TFL_APP_ID || !env.TFL_APP_KEY) {
      return json({ error: "TfL API credentials are not configured" }, 500);
    }

    const stopTypes = url.searchParams.get("stopTypes") ?? DEFAULT_STOP_TYPES;
    const radius = url.searchParams.get("radius") ?? DEFAULT_RADIUS;
    const modes = url.searchParams.get("modes") ?? DEFAULT_MODES;
    const requestedModes = new Set(
      modes.split(",").map((m) => m.trim()).filter(Boolean),
    );

    try {
      const allStops = await fetchNearestStops(lat, lng, stopTypes, radius, env);
      const stops = allStops.slice(0, MAX_STOPS);
      const stations = await fetchDepartures(stops, requestedModes, env);

      for (const s of stations) {
        s.departures = s.departures.slice(0, MAX_DEPARTURES_PER_STOP);
      }

      return json({ stations, lat, lng } satisfies NearestResponse);
    } catch (err) {
      console.error(err);
      return json({ error: "Failed to fetch departures from TfL" }, 502);
    }
  },
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}
