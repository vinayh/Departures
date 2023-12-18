import { useState } from "react"
// import Welcome from "./components/Welcome"
import Controls from "./components/Controls"
import Map from "./components/Map"

export default function App() {
    const [lat, setLat] = useState(51.5072)
    const [lon, setLon] = useState(-0.1276)

    return (
        <>
        {/* <Welcome /> */}
        <div className="column left">
        <Controls setLat={setLat} setLon={setLon} />
        </div>
        
        <div className="column right">
        <Map lat={lat} lon={lon} />
        </div>
        </>
    );
}