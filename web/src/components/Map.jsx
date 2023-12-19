import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import "../css/main.css"


export default function Map({ loc }) {
    async function getDepartures(lat, lon) {
        // TODO: Connect to departures API
        try {
            const reqUrl = `localhost:5000?lat=${lat}&lon=${lon}`
            console.log(reqUrl)
            const response = await fetch(reqUrl, { method: 'GET' });

            if (!response.ok) {
                throw new Error('Error in departures API response', response.status);
            }

            const responseJson = await response.json()
            console.log(responseJson)
            // setLoc([responseJson.result.latitude, responseJson.result.longitude])
        } catch (e) {
            console.error('Error fetching departures:', e)
        }
    }

    function ChangeLoc({ center }) {
        const map = useMap();
        map.setView(center);
        

    }

    return (
        <>
        Lat: {loc[0]}, lon: {loc[1]}
        <MapContainer center={loc} zoom={13}>
            <ChangeLoc center={loc} />
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
        </>
    )
}