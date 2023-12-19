import { useState } from "react"
// import Welcome from "./components/Welcome"
import Controls from "./components/Controls"
import Map from "./components/Map"

export default function App() {
    const [loc, setLoc] = useState([51.5072, -0.1276])

    return (
        <>
        {/* <Welcome /> */}
        <div className="column left">
        <Controls setLoc={setLoc} />
        </div>
        
        <div className="column right">
        <Map loc={loc} />
        </div>
        </>
    );
}