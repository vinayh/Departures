import type { Env, Stop, Departure, StationDepartures, TflStopPoint, TflArrival } from "./types";

const BASE_URL = "https://api.tfl.gov.uk/StopPoint";

export async function fetchNearestStops(
  lat: number,
  lng: number,
  stopTypes: string,
  radius: string,
  env: Env,
): Promise<Stop[]> {
  const params = authParams(env, {
    lat: String(lat),
    lon: String(lng),
    radius,
    stopTypes,
    categories: "none",
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) {
    throw new Error(`StopPoint request failed (${res.status})`);
  }

  let data: { stopPoints?: TflStopPoint[] };
  try {
    data = await res.json();
  } catch {
    throw new Error(`StopPoint response returned invalid JSON (${res.status})`);
  }
  return (data.stopPoints ?? []).map((s) => ({
    id: s.id,
    lat: s.lat,
    lon: s.lon,
    name: s.commonName,
    stopType: s.stopType,
    modes: s.modes,
    distance: s.distance,
  }));
}

export async function fetchDepartures(
  stops: Stop[],
  modes: Set<string>,
  env: Env,
): Promise<StationDepartures[]> {
  const relevant = modes.size > 0
    ? stops.filter((s) => s.modes.some((m) => modes.has(m)))
    : stops;

  const results = await Promise.all(
    relevant.map((stop) =>
      fetchStopDepartures(stop, modes, env).catch((err) => {
        console.error(`Departures failed for ${stop.id}`, err);
        return null;
      }),
    ),
  );

  return results.filter(
    (r): r is StationDepartures => r !== null && r.departures.length > 0,
  );
}

async function fetchStopDepartures(
  stop: Stop,
  modes: Set<string>,
  env: Env,
): Promise<StationDepartures> {
  const res = await fetch(`${BASE_URL}/${stop.id}/Arrivals?${authParams(env)}`);
  if (!res.ok) {
    throw new Error(`Arrivals request failed for ${stop.id} (${res.status})`);
  }

  let arrivals: TflArrival[];
  try {
    arrivals = await res.json();
  } catch {
    throw new Error(`Arrivals response returned invalid JSON for ${stop.id} (${res.status})`);
  }
  const departures: Departure[] = arrivals
    .filter((a) => modes.size === 0 || modes.has(a.modeName))
    .sort((a, b) => a.timeToStation - b.timeToStation)
    .map((a) => ({
      id: a.id,
      line: a.lineId,
      mode: a.modeName,
      destination: a.destinationName ?? "[Unknown]",
      arrivalTime: a.expectedArrival,
    }));

  return { station: stop, departures };
}

function authParams(env: Env, extra: Record<string, string> = {}): URLSearchParams {
  const params = new URLSearchParams(extra);
  params.set("app_id", env.TFL_APP_ID);
  params.set("app_key", env.TFL_APP_KEY);
  return params;
}
