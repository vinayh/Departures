// import { useEffect } from "react"
import "../css/main.css"


export function Postcode({ setLoc }) {
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
            setLoc([responseJson.result.latitude, responseJson.result.longitude])
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

export function Geolocation({ setLoc }) {
    function handleGeolocation() {
        const options = {
            timeout: 5000,
            enableHighAccuracy: true,
            maximumAge: 0,
        };
    
        function success(posObj) {
            console.log(`Got geolocation: ${posObj}, ${posObj.coords.latitude}, ${posObj.coords.longitude}`)
            setLoc([posObj.coords.latitude, posObj.coords.longitude])
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

export function LatLonForm({ setLoc }) {
    function handleFormLatLon(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries())
        setLoc([formJson["latitude"], formJson["longitude"]]);
    }

    return (
        <form onSubmit={handleFormLatLon}>
            <label>
                Latitude: <input name="latitude" defaultValue="51.5072" />
            </label>
            <br></br>
            <label>
                Longitude: <input name="longitude" defaultValue="-0.1276" />
            </label>

            <button type="submit">Submit</button>
        </form>
    )
}

export default function Controls({ setLoc }) {
    return (
        <>
        <h1>Departures</h1>
        <Geolocation setLoc={setLoc} />
        <hr></hr>
        <Postcode setLoc={setLoc} />
        <hr></hr>
        <LatLonForm setLoc={setLoc} />
        </>
    )
}