# Departures backend

This repository now exposes the `/nearest` endpoint via a Cloudflare Worker.
The Worker calls the public TfL APIs to find nearby stops and return departures
for the requested modes.

## Prerequisites

- Node.js 18+
- Cloudflare Wrangler CLI (installed automatically via `npm install`)
- TfL API credentials stored as Cloudflare Worker secrets:
  - `wrangler secret put TFL_APP_ID`
  - `wrangler secret put TFL_APP_KEY`

## Local development

```bash
npm install
npm run dev
```

Wrangler will start a local preview at `http://localhost:8787`.

## Deployment

```bash
npm run deploy
```

## API

`GET /nearest?lat=<latitude>&lng=<longitude>&stopTypes=<comma-separated>&modes=<comma-separated>`

- `lat` and `lng` are required.
- `stopTypes` defaults to `NaptanMetroStation,NaptanRailStation`.
- `modes` defaults to `tube,dlr,overground,elizabeth-line,bus`.

The response mirrors the previous Flask structure:

```json
{
  "lat": 51.501,
  "lng": -0.124,
  "stnsDeps": [
    {
      "station": {
        "id": "940GZZLUGPK",
        "name": "Green Park Underground Station",
        "modes": ["tube"],
        "stop_type": "NaptanMetroStation",
        "distance": 210.5,
        "lat": 51.502,
        "lon": -0.143
      },
      "departures": [
        {
          "id": "UniqueTripId",
          "line": "jubilee",
          "mode": "tube",
          "destination": "Stanmore",
          "arrival_time": "2024-11-27T09:12:30Z"
        }
      ]
    }
  ]
}
```
