// import { useEffect } from "react"
import "../css/main.css"


export function Postcode({ map }) {
    async function handlePostcode(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const postcode = formData.get("postcode");
        try {
            const reqUrl = `https://api.postcodes.io/postcodes/${postcode}`
            console.log(reqUrl)
            const response = await fetch(reqUrl, { method: 'GET' });

            if (!response.ok) {
                if (response.status == 404) {
                    this.setState({postcode: "Invalid postcode"})
                }
                throw new Error('Error in postcode API response', response.status);
            }

            const responseJson = await response.json()
            console.log(responseJson)
            map.flyTo([responseJson.result.latitude, responseJson.result.longitude])
        } catch (e) {
            console.error('Error fetching postcode:', e)
            // TODO: Display error (flash message or similar)
        }
    }

    return (
        <>
        <form onSubmit={handlePostcode}>
            <label>
                Postcode: <input name="postcode" />
            </label>
            <button type="submit">Submit</button>
        </form>
        </>
    )
}

export function Geolocation({ map }) {
    function handleGeolocation() {
        const options = {
            timeout: 5000,
            enableHighAccuracy: true,
            maximumAge: 0,
        };
    
        function success(posObj) {
            console.log(`Got geolocation: ${posObj}, ${posObj.coords.latitude}, ${posObj.coords.longitude}`)
            map.flyTo([posObj.coords.latitude, posObj.coords.longitude])
        }
    
        function error(e) {
            console.warn(`Geolocation error: ${e}`)
        }
    
        if (navigator.geolocation) {
            navigator.permissions.query({ name: "geolocation" })
                .then((result) => {
                    console.log(result);
                    if (result.state === "granted" || result.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(success, error, options);
                    }
                    else {
                        console.log('Geolocation access denied.');
                        return <h2>Browser location access denied.</h2>
                    }
                })
        }
        else {
            console.log("Geolocation not supported.");
        }
    }

    return (
        <label>
        Detect location automatically: <button onClick={handleGeolocation}>Detect location</button>
        </label>
    )
}

export function LatLonForm({ map }) {
    function handleFormLatLon(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries())
        const formCenter = [formJson["latitude"], formJson["longitude"]]
        console.log(`Setting center to ${formCenter}`)
        // setCenter(formCenter);
        map.flyTo(formCenter)
    }

    return (
        <form onSubmit={handleFormLatLon}>
            <label>
                Latitude: <input name="latitude" />
            </label>
            <br></br>
            <label>
                Longitude: <input name="longitude" />
            </label>

            <button type="submit">Submit</button>
        </form>
    )
}

export default function Controls({ map }) {
    return (
        <>
        <h1>Departures</h1>
        <Geolocation map={map} />
        <hr></hr>
        <Postcode map={map} />
        <hr></hr>
        <LatLonForm map={map} />
        </>
    )
}
