import { useState, Fragment, Dispatch, SetStateAction } from "react"
import type { Departure, StationDepartures, NearestResponse } from "../../../departures-backend/src/types"
import { Map } from "leaflet"
import "../css/main.css"

export type { StationDepartures } from "../../../departures-backend/src/types"

export function renderSingleDeparture(dep: Departure) {
    const arrivalTime: number = new Date(dep.arrivalTime).getTime()
    const dep_min: number = (arrivalTime - Date.now()) / (1000 * 60)
    const dep_min_str: string = dep_min.toFixed(0)
    return (
        <p key={dep.id}>
            {dep.line} - {dep.destination} -{" "}
            {dep_min_str !== "-0" ? dep_min_str : "0"}
        </p>
    )
}

export function Departures({
    map,
    departures,
    setDepartures,
    setCenterMarker,
}: {
    map: Map | null
    departures: StationDepartures[]
    setDepartures: Dispatch<SetStateAction<StationDepartures[]>>
    setCenterMarker: Dispatch<SetStateAction<[number, number] | null>>
}): React.JSX.Element {
    const [isLoading, setIsLoading] = useState(false)

    function updateDepartures() {
        if (map) {
            setIsLoading(true)
            const reqCenter = map.getCenter()
            const reqUrl = `https://departures-worker.mail-d7c.workers.dev/nearest?lat=${reqCenter.lat}&lng=${reqCenter.lng}`
            setCenterMarker([reqCenter.lat, reqCenter.lng])
            fetch(reqUrl)
                .then(response => response.json())
                .then(data => {
                    const response = data as NearestResponse
                    const allStationDeps: StationDepartures[] =
                        response.stations
                    setDepartures(allStationDeps)
                    setIsLoading(false)
                })
                .catch(e => console.error("Error fetching departures:", e))
        }
    }

    function renderStationDepartures({
        station,
        departures,
    }: StationDepartures): React.JSX.Element {
        return (
            <li key={station.id}>
                <b>{station.name}</b>
                <hr></hr>
                {departures.map(renderSingleDeparture)}
            </li>
        )
    }

    function StationDepartures(): React.JSX.Element {
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
