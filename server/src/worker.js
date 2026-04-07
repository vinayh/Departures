const STOPPOINT_ENDPOINT = "https://api.tfl.gov.uk/StopPoint";
const ARRIVALS_ENDPOINT = (id) => `https://api.tfl.gov.uk/StopPoint/${id}/Arrivals`;

const DEFAULT_STOP_TYPES = "NaptanMetroStation,NaptanRailStation";
const DEFAULT_MODES = "tube,dlr,overground,elizabeth-line,bus";
const MAX_STOPS = 6;
const MAX_DEPARTURES_PER_STOP = 25;
const DEFAULT_RADIUS = "2000";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return corsResponse();
    }

    const url = new URL(request.url);
    if (url.pathname !== "/nearest") {
      return corsResponse({ error: "Not found" }, 404);
    }

    const lat = url.searchParams.get("lat");
    const lng = url.searchParams.get("lng");
    if (!lat || !lng) {
      return corsResponse({ error: "lat and lng query params are required" }, 400);
    }

    const stopTypes =
      url.searchParams.get("stopTypes") ?? DEFAULT_STOP_TYPES;
    const radius = url.searchParams.get("radius") ?? DEFAULT_RADIUS;
    const modes = url.searchParams.get("modes") ?? DEFAULT_MODES;

    try {
      const stops = await fetchNearestStops(
        { lat, lng, stopTypes, radius },
        env,
      );
      const stnsDeps = await fetchDeparturesForStops(stops, modes, env);
      return corsResponse({ stnsDeps, lat, lng });
    } catch (err) {
      console.error(err);
      return corsResponse(
        { error: "Failed to fetch departures from TfL" },
        502,
      );
    }
  },
};

async function fetchNearestStops({ lat, lng, stopTypes, radius }, env) {
  const params = withAuthParams(env, {
    lat,
    lon: lng,
    radius,
    stopTypes,
    categories: "none",
  });

  const response = await fetch(`${STOPPOINT_ENDPOINT}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(
      `StopPoint request failed with status ${response.status}`,
    );
  }

  const data = await response.json();
  const stopPoints = Array.isArray(data.stopPoints) ? data.stopPoints : [];
  return stopPoints.slice(0, MAX_STOPS).map((stop) => ({
    id: stop.id,
    lat: stop.lat,
    lon: stop.lon,
    name: stop.commonName,
    stopType: stop.stopType,
    modes: stop.modes,
    distance: stop.distance,
  }));
}

async function fetchDeparturesForStops(stops, modesParam, env) {
  if (!stops.length) {
    return [];
  }

  const requestedModes = new Set(
    modesParam
      .split(",")
      .map((mode) => mode.trim())
      .filter(Boolean),
  );

  const departures = await Promise.all(
    stops.map((stop) =>
      fetchDeparturesForStop(stop, requestedModes, env).catch((err) => {
        console.error(`Failed fetching departures for ${stop.id}`, err);
        return null;
      }),
    ),
  );

  return departures.filter((entry) => entry && entry.departures.length > 0);
}

async function fetchDeparturesForStop(stop, modeSet, env) {
  const params = withAuthParams(env);
  const response = await fetch(`${ARRIVALS_ENDPOINT(stop.id)}?${params}`);
  if (!response.ok) {
    throw new Error(`Arrivals request failed for ${stop.id}`);
  }

  const arrivals = await response.json();
  const sorted = arrivals
    .filter((item) => modeSet.size === 0 || modeSet.has(item.modeName))
    .sort((a, b) => a.timeToStation - b.timeToStation)
    .slice(0, MAX_DEPARTURES_PER_STOP)
    .map((item) => ({
      id: item.id,
      line: item.lineId,
      mode: item.modeName,
      destination: item.destinationName ?? "[Unknown]",
      arrival_time: item.expectedArrival,
    }));

  return {
    station: {
      id: stop.id,
      lat: stop.lat,
      lon: stop.lon,
      name: stop.name,
      stop_type: stop.stopType,
      modes: stop.modes,
      distance: stop.distance,
    },
    departures: sorted,
  };
}

function withAuthParams(env, params = {}) {
  const result = new URLSearchParams(params);
  if (!env.TFL_APP_ID || !env.TFL_APP_KEY) {
    throw new Error("Missing required TfL credentials in Worker env");
  }
  result.set("app_id", env.TFL_APP_ID);
  result.set("app_key", env.TFL_APP_KEY);
  return result;
}

function corsResponse(body = {}, status = 200) {
  const payload = body instanceof Response ? body : JSON.stringify(body);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };

  if (body instanceof Response) {
    Object.entries(headers).forEach(([key, value]) =>
      body.headers.set(key, value),
    );
    return body;
  }

  return new Response(payload, {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

