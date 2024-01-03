import "../css/main.css"


function Postcode({ map }): JSX.Element {
    async function handlePostcode(e: React.FormEvent) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const postcode = formData.get("postcode");
        try {
            const reqUrl = `https://api.postcodes.io/postcodes/${postcode}`
            console.log(reqUrl)
            const response = await fetch(reqUrl, { method: 'GET' });

            if (!response.ok) {
                if (response.status == 404) {
                    this.setState({ postcode: "Invalid postcode" })
                }
                throw new Error(`Error in postcode API response ${response.status}`);
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

        function error(e: Error) {
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
            Detect location automatically: <button onClick={handleGeolocation}>Detect location</button>
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
