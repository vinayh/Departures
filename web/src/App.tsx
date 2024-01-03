import { React, useState } from "react"
import Controls from "./components/Controls"
import Map from "./components/Map"

export default function App(): JSX.Element {
    const [map, setMap] = useState(null);
    

    return (
        <>
        <div className="column left">
        <Controls map={map} />
        </div>
        
        <div className="column right">
        <Map map={map} setMap={setMap} />
        </div>
        </>
    );
}