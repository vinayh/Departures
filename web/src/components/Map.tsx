import { useState, useEffect, Fragment, useCallback, useMemo } from "react"
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import "../css/main.css"

// See https://react-leaflet.js.org/docs/example-external-state/ for probably a more relevant guide on
// using external state with react-leaflet

// export default async function Map({ loc }: { loc: [number, number] }) {
export default function Map({ center, setCenter, map, setMap }) {
    const [departures, setDepartures] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const defaultCenter = [51.5072, -0.1276]
    const defaultZoom = 13

    function ShowPosition() {
        const resetView = useCallback(() => map.setView(defaultCenter, defaultZoom), [map])
        const onMove = useCallback(() => setCenter(map.getCenter()), [map])

        useEffect(() => {
            map.on('move', onMove);
            return () => {
                map.off('move', onMove);
            }
        }, [map, onMove])

        if ((center.lat === undefined) || (center.lng === undefined)) {
            setCenter(defaultCenter)
        }
        return (
            <>
                Latitude: {center.lat.toFixed(4)}, longitude: {center.lng.toFixed(4)}
                <br></br>
                <button onClick={resetView}>Reset</button>
            </>
        )
    }

    async function loadDepartures() {
        try {
            setIsLoading(true)
            const reqCenter = map.getCenter()
            const reqUrl = `http://127.0.0.1:5000/nearest?lat=${reqCenter.lat}&lon=${reqCenter.lng}`
            console.log(reqUrl)
            const response = fetch(reqUrl, {method: "GET"})
            .then(response => response.json())
            .then(data => {
                setDepartures(Object.values(data))
                setIsLoading(false)
            })
            const responseJson = await response.json();
            setDepartures(Object.values(responseJson))
            // console.log(Object.values(responseJson))
        } catch (e) {
            console.error('Error fetching departures:', e)
        }
    }

    function ShowDepartures() {
        const [departureMarkers, setDepartureMarkers] = useState<JSX.Element[]>([]);

        useEffect(() => {
            console.log(departures)
            const markers = departures.map((dep) => (
                <Marker key={dep.id} position={[dep.lat, dep.lon]} />
            ));
            setDepartureMarkers(markers);
        }, [departures]);

        console.log(departureMarkers)
        // return <Fragment>{departureMarkers}</Fragment>;
        return departureMarkers
    }


    return (
        <>
            {/* Lat: {center[0]}, lon: {center[1]} */}
            {map ? <ShowPosition /> : null}
            {isLoading ? <p>Loading...</p> : <button onClick={loadDepartures}>Update departures</button>}
            <MapContainer center={defaultCenter} zoom={defaultZoom} ref={setMap}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <Fragment>
                    {departures.map((dep) => <Marker position={[dep[0].lat, dep[0].lon]}></Marker>)}
                </Fragment> */}
                <ShowDepartures />
            </MapContainer>
        </>
    )
}
