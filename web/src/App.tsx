import { React, useState } from "react"
import Controls from "./components/Controls"
import Map from "./components/Map"

export default function App(): JSX.Element {
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({lat: 51.5072, lng: -0.1276})

    return (
        <>
        <div className="column left">
        <Controls map={map} />
        </div>
        
        <div className="column right">
        <Map center={center} setCenter={setCenter} map={map} setMap={setMap} />
        </div>
        </>
    );
}