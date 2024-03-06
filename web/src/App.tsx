import { useState } from "react"
import { Map } from "leaflet"
import Departures, { StationDepartures } from "./components/Departures"
import Controls from "./components/Controls"
import MapView from "./components/MapView"

export default function App(): JSX.Element {
    const [map, setMap] = useState<Map | null>(null)
    const [departures, setDepartures] = useState<StationDepartures[]>([])
    const [centerMarker, setCenterMarker] = useState<[number, number] | null>(
        null
    )

    return (
        <>
            <div className="column left">
                <Controls map={map} setCenterMarker={setCenterMarker} />
                <br></br>
                <br></br>
                <Departures
                    map={map}
                    departures={departures}
                    setDepartures={setDepartures}
                    setCenterMarker={setCenterMarker}
                />
            </div>

            <div className="column right">
                <MapView
                    map={map}
                    setMap={setMap}
                    departures={departures}
                    centerMarker={centerMarker}
                />
            </div>
        </>
    )
}
