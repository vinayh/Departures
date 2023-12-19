import { useEffect } from "react"
import "../css/main.css"


export default function Controls({ setLoc }) {
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

    function handleFormLatLon(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries())
        setLoc([formJson["latitude"], formJson["longitude"]]);
    }

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
                    }
                })
        }
        else {
            console.log("Geolocation not supported.");
        }
    }

    return (
        <>
            <h1>Departures</h1>

            <button onClick={handleGeolocation}>Detect location</button>
            <br></br><br></br>

            <hr></hr>

            <form onSubmit={handlePostcode}>
                <label>
                    Postcode: <input name="postcode" />
                </label>
                <button type="submit">Submit</button>
            </form>

            <hr></hr>

            <form onSubmit={handleFormLatLon}>
                <label>
                    Latitude: <input name="latitude" defaultValue="51.5072" />
                </label>
                <br></br><br></br>
                <label>
                    Longitude: <input name="longitude" defaultValue="-0.1276" />
                </label>

                <button type="submit">Submit</button>
            </form>
        </>
    )
}