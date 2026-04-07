# Departures backend

A Cloudflare Worker that returns upcoming TfL departures for nearby stations in London. Used by the Departures web and iOS widget frontends.

## Setup

Requires Node.js 18+. Wrangler CLI is installed as a dev dependency.

```bash
npm install
```

TfL API credentials are needed. For local development, create a `.env` file:

```
TFL_APP_ID=your_app_id
TFL_APP_KEY=your_app_key
```

For production, set them as Cloudflare Worker secrets:

```bash
wrangler secret put TFL_APP_ID
wrangler secret put TFL_APP_KEY
```

## Development

```bash
npm run dev        # local preview at http://localhost:8787
npm run check      # type-check
```

## Deployment

```bash
npm run deploy
```

## API

`GET /nearest?lat=<latitude>&lng=<longitude>&stopTypes=<types>&modes=<modes>&radius=<meters>`

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `lat` | yes | | Latitude |
| `lng` | yes | | Longitude |
| `stopTypes` | no | `NaptanMetroStation,NaptanRailStation` | Comma-separated TfL stop types |
| `modes` | no | `tube,dlr,overground,elizabeth-line,bus` | Comma-separated transport modes |
| `radius` | no | `2000` | Search radius in meters |

### Response

```json
{
  "lat": 51.501,
  "lng": -0.124,
  "stations": [
    {
      "station": {
        "id": "940GZZLUGPK",
        "name": "Green Park Underground Station",
        "modes": ["tube"],
        "stopType": "NaptanMetroStation",
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
          "arrivalTime": "2024-11-27T09:12:30Z"
        }
      ]
    }
  ]
}
```

## Breaking changes

The response shape changed from the previous Python/Flask backend:

- `stnsDeps` renamed to `stations`
- `arrival_time` renamed to `arrivalTime`
- `stop_type` renamed to `stopType`
