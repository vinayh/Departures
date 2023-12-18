import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import "../css/main.css"


export default function Map({ lat, lon }) {
    return (
        <>
        Lat: {lat}, lon: {lon}
        <MapContainer center={[51.5072, -0.1276]} zoom={13}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
        </>
    )
}