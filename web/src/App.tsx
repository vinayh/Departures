import { useState } from "react"
import Departures from "./components/Departures"
import Controls from "./components/Controls"
import Map from "./components/Map"

export default function App(): JSX.Element {
    const [map, setMap] = useState(null);
    const [departures, setDepartures] = useState([])
    const [centerMarker, setCenterMarker] = useState()

    return (
        <>
            <div className="column left">
                <Controls map={map} setCenterMarker={setCenterMarker} />
                <br></br><br></br>
                <Departures map={map} departures={departures} setDepartures={setDepartures} setCenterMarker={setCenterMarker} />
            </div>

            <div className="column right">
                <Map map={map} setMap={setMap} departures={departures} centerMarker={centerMarker} />
            </div>
        </>
    );
}