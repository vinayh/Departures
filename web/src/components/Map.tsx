import { React, useState, useEffect, Fragment, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"
import 'leaflet/dist/leaflet.css'
import "../css/main.css"

import { StationDeps, renderSingleDeparture } from "./Departures"
import { stat } from "fs"

export default function Map({ map, setMap, departures, centerMarker }): JSX.Element {
    const defaultCenter = { lat: 51.5072, lng: -0.1276 }
    const [center, setCenter] = useState(defaultCenter)
    const defaultZoom = 13
    const stationIcon = new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      })

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
                &nbsp;
                <button onClick={resetView}>Reset map location</button>
            </>
        )
    }

    function renderStationMarker([stn, deps]: StationDeps): JSX.Element {
        return (
            <Marker key={stn.id} position={[stn.lat, stn.lon]} icon={stationIcon}>
                <Popup>
                    <b>{stn.name}</b>
                    <hr></hr>
                    {deps.map(renderSingleDeparture)}
                </Popup>
            </Marker>
        )
    }

    function StationMarkers(): JSX.Element {
        return <Fragment>
            {departures.map(renderStationMarker)}
        </Fragment>
    }

    return (
        <>
            {map ? <ShowPosition /> : null}
            <MapContainer center={defaultCenter} zoom={defaultZoom} ref={setMap}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {centerMarker ? <Marker position={centerMarker}></Marker> : null}
                <StationMarkers />
            </MapContainer>
        </>
    )
}
