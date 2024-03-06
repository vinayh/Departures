import { useState, Fragment, Dispatch, SetStateAction } from "react"
import "../css/main.css"
import { Map } from "leaflet"

type Departure = {
    id: string
    line: string
    mode: string
    destination: string
    arrival_time: string
}

type Station = { id: string; lat: number; lon: number; name: string }

export type StationDepartures = { station: Station; departures: Departure[] }

type Response = { stnsDeps: StationDepartures[]; lat: number; lng: number }

export function renderSingleDeparture(dep: Departure) {
    const arrival_time: number = new Date(dep.arrival_time).getTime()
    const dep_min: number = (arrival_time - Date.now()) / (1000 * 60)
    const dep_min_str: string = dep_min.toFixed(0)
    return (
        <p key={dep.id}>
            {dep.line} - {dep.destination} -{" "}
            {dep_min_str !== "-0" ? dep_min_str : "0"}
        </p>
    )
}

export default function Departures({
    map,
    departures,
    setDepartures,
    setCenterMarker,
}: {
    map: Map | null
    departures: StationDepartures[]
    setDepartures: Dispatch<SetStateAction<StationDepartures[]>>
    setCenterMarker: Dispatch<SetStateAction<[number, number] | null>>
}): JSX.Element {
    const [isLoading, setIsLoading] = useState(false)

    function updateDepartures() {
        if (map) {
            setIsLoading(true)
            const reqCenter = map.getCenter()
            const reqUrl = `https://departures-backend.azurewebsites.net/api/nearest?lat=${reqCenter.lat}&lng=${reqCenter.lng}`
            // console.log(reqUrl)
            setCenterMarker([reqCenter.lat, reqCenter.lng])
            fetch(reqUrl)
                .then(response => response.json())
                .then(data => {
                    const response = data as Response
                    const allStationDeps: StationDepartures[] =
                        response.stnsDeps
                    setDepartures(allStationDeps)
                    setIsLoading(false)
                })
                .catch(e => console.error("Error fetching departures:", e))
        }
    }

    function renderStationDepartures({
        station,
        departures,
    }: StationDepartures): JSX.Element {
        return (
            <li key={station.id}>
                <b>{station.name}</b>
                <hr></hr>
                {departures.map(renderSingleDeparture)}
            </li>
        )
    }

    function StationDepartures(): JSX.Element {
        return (
            <Fragment>
                <ol>{departures.map(renderStationDepartures)}</ol>
            </Fragment>
        )
    }

    return (
        <>
            <button id="update-button" onClick={updateDepartures}>
                {isLoading ? "Loading..." : "Update departures"}
            </button>
            <StationDepartures />
        </>
    )
}
