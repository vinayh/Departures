import React from "react";
import "../css/main.css"


function Postcode({ map }): JSX.Element {
    function handlePostcode(e: React.FormEvent) {
        e.preventDefault();
        const postcode: string = e.target.postcode.value
        const reqUrl = `https://api.postcodes.io/postcodes/${postcode}`
        console.log(reqUrl)
        fetch(reqUrl)
            .then(res => {
                if (!res.ok) {
                    if (res.status == 404) {
                        // this.setState({ postcode: "Invalid postcode" })
                        console.log(`Invalid postcode: ${postcode}`)
                    }
                    throw new Error(`Error in postcode API response ${res.status}`);
                }
                return res
            })
            .then(res => res.json())
            .then(res => map.flyTo([res.result.latitude, res.result.longitude]))
            .catch(e => console.error('Error fetching postcode:', e))
    }

    return (
        <>
            <form onSubmit={handlePostcode}>
                <label>
                    Postcode: <input name="postcode" />
                </label>
                <br></br>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

function Geolocation({ map }): JSX.Element {
    function handleGeolocation() {
        const options = {
            timeout: 5000,
            enableHighAccuracy: true,
            maximumAge: 0,
        };

        function success(posObj: GeolocationPosition) {
            console.log(`Got geolocation: ${posObj}, ${posObj.coords.latitude}, ${posObj.coords.longitude}`)
            map.flyTo([posObj.coords.latitude, posObj.coords.longitude])
        }

        function error(e: GeolocationPositionError) {
            console.warn(`Geolocation error: ${e}`)
        }

        if (navigator.geolocation) {
            navigator.permissions.query({ name: "geolocation" })
                .then((result) => {
                    console.log(result);
                    if (result.state === "granted" || result.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(success, error, options);
                    }
                })
                .catch((e) => {
                    console.log('Geolocation access denied.');
                    return <h2>Browser location access denied.</h2>
                })
        }
        else {
            console.log("Geolocation not supported.");
        }
    }

    return (
        <label>
            Use browser location:
            <br></br>
            <button onClick={handleGeolocation}>Detect location</button>
        </label>
    )
}

function LatLonForm({ map }): JSX.Element {
    function handleFormLatLon(e: React.FormEvent) {
        e.preventDefault();
        const formLoc = [e.target.latitude.value, e.target.longitude.value]
        console.log(`Setting center to ${formLoc}`)
        map.flyTo(formLoc)
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
            <br></br>
            <button type="submit">Submit</button>
        </form>
    )
}

export default function Controls({ map }): JSX.Element {
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
