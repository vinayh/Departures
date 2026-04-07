# Departures

Upcoming TfL departure times for nearby stations in London. Includes a backend API, a web app, and native Apple apps (iOS, watchOS, widget).

## Structure

```
server/    Cloudflare Worker backend (TypeScript)
web/       Web app (React + TypeScript + Leaflet)
apple/     iOS, watchOS, and widget apps (SwiftUI)
```

## Server

A Cloudflare Worker that queries the TfL API for nearby stops and their upcoming departures. Written in TypeScript, deployed to Cloudflare's edge network.

### Setup

Requires Node.js 18+.

```bash
cd server
npm install
```

Create a `server/.env` file with TfL API credentials for local development:

```
TFL_APP_ID=your_app_id
TFL_APP_KEY=your_app_key
```

For production, set them as Cloudflare Worker secrets:

```bash
wrangler secret put TFL_APP_ID
wrangler secret put TFL_APP_KEY
```

### Development and deployment

```bash
npm run dev        # local preview at http://localhost:8787
npm run check      # type-check
npm run deploy     # deploy to Cloudflare
```

### API

`GET /nearest?lat=<lat>&lng=<lng>&stopTypes=<types>&modes=<modes>&radius=<meters>`

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `lat` | yes | | Latitude |
| `lng` | yes | | Longitude |
| `stopTypes` | no | `NaptanMetroStation,NaptanRailStation` | Comma-separated TfL stop types |
| `modes` | no | `tube,dlr,overground,elizabeth-line,bus` | Comma-separated transport modes |
| `radius` | no | `2000` | Search radius in meters |

Response:

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

## Web

A React + TypeScript web app using Leaflet for an interactive map. Supports location via browser geolocation, UK postcode lookup, or manual coordinates.

### Setup

```bash
cd web
yarn install
```

### Development and deployment

```bash
yarn dev           # start Vite dev server
yarn build         # type-check and build
yarn deploy        # deploy to GitHub Pages
```

The web app imports shared TypeScript types from `server/src/types.ts` via a symlink at `web/src/shared-types.ts`.

## Apple

Native SwiftUI apps for iOS and watchOS, plus an iOS home/lock screen widget. Features:

- Automatic location-based departure updates
- Configurable station type and transport mode filters
- Map view with station markers (iOS)
- Shared data cache between app and widget via App Group
- Independent watchOS app (works without iPhone)

### Setup

Open `apple/Departures.xcodeproj` in Xcode. Targets:

| Target | Platform | Description |
|--------|----------|-------------|
| Departures | iOS 17+ | Main app with map and departure list |
| DeparturesWatch Watch App | watchOS 10+ | Standalone watch app |
| DeparturesWidgetExtension | iOS 15+ | Home/lock screen widget |
