import { React, useState, useEffect, Fragment, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import "../css/main.css"

type StationDeps = [{ id: string, lat: number, lon: number, name: string },
    { line: string, mode: string, destination: string, arrival_time: string }[]];


export default function Map({ map, setMap }): JSX.Element {
    const [departures, setDepartures] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const defaultCenter = { lat: 51.5072, lng: -0.1276 }
    const [center, setCenter] = useState(defaultCenter)
    const defaultZoom = 13

    function ShowPosition(): JSX.Element {
        const resetView = useCallback(() => map.setView(defaultCenter, defaultZoom), [map])
        const onMove = useCallback(() => setCenter(map.getCenter()), [map])

        useEffect(() => {
            map.on('move', onMove);
            return () => {
                map.off('move', onMove);
            }
        }, [map, onMove])

        return (
            <>
                Latitude: {center.lat.toFixed(4)}, longitude: {center.lng.toFixed(4)}
                <br></br>
                <button onClick={resetView}>Reset location</button>
            </>
        )
    }

    function renderStation(station: StationDeps): JSX.Element {
        return (
            <>
                <Marker key={station[0].id} position={[station[0].lat, station[0].lon]}>
                    <Popup>
                        <b>{station[0].name}</b>
                        <hr></hr>
                        {station[1].map((dep) => {
                            const arrival_time: number = new Date(dep.arrival_time).getTime()
                            const dep_min: number = ((arrival_time - Date.now()) / (1000 * 60))
                            const dep_min_str: string = dep_min.toFixed(0) !== "-0" ? dep_min.toFixed(0) : "0"
                            return <p>{dep.line} - {dep.destination} - {dep_min_str}</p>
                        })}
                    </Popup>
                </Marker>
            </>
        )
    }

    function loadDepartures() {
        setIsLoading(true)
        const reqCenter = map.getCenter()
        const reqUrl = `http://127.0.0.1:5000/nearest?lat=${reqCenter.lat}&lon=${reqCenter.lng}`
        // console.log(reqUrl)
        fetch(reqUrl)
            .then(response => response.json())
            .then(data => {
                const allStationDeps: StationDeps[] = Object.values(data)
                setDepartures(allStationDeps.map(renderStation))
                setIsLoading(false)
            })
            .catch(e => console.error('Error fetching departures:', e))
    }

    return (
        <>
            {map ? <ShowPosition /> : null}
            {isLoading ? <button>Loading...</button> : <button onClick={loadDepartures}>Update departures</button>}
            <MapContainer center={defaultCenter} zoom={defaultZoom} ref={setMap}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Fragment>{departures}</Fragment>
            </MapContainer>
        </>
    )
}
