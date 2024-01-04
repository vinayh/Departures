import { React, useState } from "react"
import Departures from "./components/Departures"
import Controls from "./components/Controls"
import Map from "./components/Map"

export default function App(): JSX.Element {
    const [map, setMap] = useState(null);
    const [departures, setDepartures] = useState([])

    return (
        <>
        <div className="column left">
        <Controls map={map} />
        <Departures map={map} departures={departures} setDepartures={setDepartures} />
        </div>
        
        <div className="column right">
        <Map map={map} setMap={setMap} departures={departures} />
        </div>
        </>
    );
}