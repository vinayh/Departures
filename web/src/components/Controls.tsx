import { Dispatch, SetStateAction, useState } from "react"
import { Map } from "leaflet"
import "../css/main.css"

interface PostcodeElements extends HTMLFormControlsCollection {
    postcode: HTMLInputElement
}

interface PostcodeFormElement extends HTMLFormElement {
    readonly elements: PostcodeElements
}

interface LatLonElements extends HTMLFormControlsCollection {
    latitude: HTMLInputElement
    longitude: HTMLInputElement
}

interface LatLonFormElement extends HTMLFormElement {
    readonly elements: LatLonElements
}

export default function Controls({
    map,
    setCenterMarker,
}: {
    map: Map | null
    setCenterMarker: Dispatch<SetStateAction<[number, number] | null>>
}): JSX.Element {
    const [locResult, setLocResult] = useState("")

    function updateCenter(centerTuple: [number, number]) {
        if (map) {
            map.flyTo(centerTuple, 13)
            setCenterMarker(centerTuple)
        }
    }

    function Postcode(): JSX.Element {
        function handlePostcode(e: React.FormEvent<PostcodeFormElement>) {
            e.preventDefault()
            const postcode: string = e.currentTarget.elements.postcode.value
            const reqUrl = `https://api.postcodes.io/postcodes/${postcode}`
            console.log(reqUrl)
            fetch(reqUrl)
                .then(res => {
                    if (!res.ok) {
                        if (res.status == 404) {
                            setLocResult(`❌ Invalid postcode: ${postcode}`)
                            console.log(`Invalid postcode: ${postcode}`)
                        }
                        throw new Error(
                            `Error in postcode API response ${res.status}`
                        )
                    }
                    return res
                })
                .then(res => res.json())
                .then(res => {
                    setLocResult(`✅ Set to postcode: ${res.result.postcode}`)
                    updateCenter([res.result.latitude, res.result.longitude])
                })
                .catch(error => console.error("Error fetching postcode:", error.message))
        }

        return (
            <>
                <form onSubmit={handlePostcode}>
                    <label>
                        UK Postcode: <input name="postcode" />
                    </label>
                    &nbsp;
                    <button type="submit">Go</button>
                </form>
            </>
        )
    }

    function Geolocation(): JSX.Element {
        function handleGeolocation() {
            const options = {
                timeout: 5000,
                enableHighAccuracy: true,
                maximumAge: 0,
            }

            function success(posObj: GeolocationPosition) {
                const centerTuple: [number, number] = [
                    posObj.coords.latitude,
                    posObj.coords.longitude,
                ]
                console.log(`Got geolocation: ${posObj}, ${centerTuple}`)
                updateCenter(centerTuple)
                setLocResult(
                    `✅ Set to coordinates: ${centerTuple.map(x =>
                        x.toFixed(4)
                    )}`
                )
            }

            function error(e: GeolocationPositionError) {
                console.warn(`Geolocation error: ${e}`)
                setLocResult(`❌ Geolocation error: ${e}`)
                switch (e.code) {
                    case 1:
                        setLocResult("❌ Geolocation access denied")
                        break
                    case 2:
                        setLocResult("❌ Geolocation not available")
                        break
                    case 3:
                        setLocResult("❌ Geolocation timeout")
                        break
                }
            }

            if (navigator.geolocation) {
                navigator.permissions
                    .query({ name: "geolocation" })
                    .then(result => {
                        console.log(result)
                        if (
                            result.state === "granted" ||
                            result.state === "prompt"
                        ) {
                            navigator.geolocation.getCurrentPosition(
                                success,
                                error,
                                options
                            )
                        }
                    })
                    .catch(_ => {
                        console.log("Geolocation access denied.")
                        setLocResult(`❌ Geolocation access denied`)
                    })
            } else {
                console.log("Geolocation not supported.")
            }
        }

        return (
            <label>
                Use browser location: &nbsp;
                <button onClick={handleGeolocation}>Detect location</button>
            </label>
        )
    }

    function LatLonForm(): JSX.Element {
        function handleFormLatLon(e: React.FormEvent<LatLonFormElement>) {
            e.preventDefault()
            const lat = parseFloat(e.currentTarget.elements.latitude.value)
            const lng = parseFloat(e.currentTarget.elements.longitude.value)
            if (!isNaN(lat) && !isNaN(lng)) {
                updateCenter([lat, lng])
                setLocResult(`✅ Set to coordinates: ${[lat, lng]}`)
            } else {
                console.log("Invalid lat/lng form entry")
                setLocResult("❌ Invalid coordinates")
            }
        }

        return (
            <form onSubmit={handleFormLatLon}>
                <label>
                    Latitude: <input name="latitude" required />
                </label>
                <br></br>
                <label>
                    Longitude: <input name="longitude" required />
                </label>
                <br></br>
                <button type="submit">Submit</button>
            </form>
        )
    }

    return (
        <>
            <h1>Departures</h1>
            <Geolocation />
            <hr></hr>
            <Postcode />
            <hr></hr>
            <LatLonForm />
            <hr></hr>
            {locResult}
        </>
    )
}
