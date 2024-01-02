import { useState } from "react"
// import Welcome from "./components/Welcome"
import Controls from "./components/Controls"
import Map from "./components/Map"

export default function App() {
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({lat: 51.5072, lng: -0.1276})

    return (
        <>
        {/* <Welcome /> */}
        <div className="column left">
        <Controls map={map} />
        </div>
        
        <div className="column right">
        <Map center={center} setCenter={setCenter} map={map} setMap={setMap} />
        </div>
        </>
    );
}