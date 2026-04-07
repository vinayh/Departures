export interface Env {
  TFL_APP_ID: string;
  TFL_APP_KEY: string;
}

export interface Stop {
  id: string;
  lat: number;
  lon: number;
  name: string;
  stopType: string;
  modes: string[];
  distance: number;
}

export interface Departure {
  id: string;
  line: string;
  mode: string;
  destination: string;
  arrivalTime: string;
}

export interface StationDepartures {
  station: Stop;
  departures: Departure[];
}

export interface NearestResponse {
  stations: StationDepartures[];
  lat: number;
  lng: number;
}

export interface TflStopPoint {
  id: string;
  lat: number;
  lon: number;
  commonName: string;
  stopType: string;
  modes: string[];
  distance: number;
}

export interface TflArrival {
  id: string;
  lineId: string;
  modeName: string;
  destinationName?: string;
  expectedArrival: string;
  timeToStation: number;
}
