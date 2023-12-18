import { useState } from "react"
import "../css/main.css"


export default function Controls({ setLat, setLon }) {
    function updateLoc(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formJson = Object.fromEntries(formData.entries())
        setLat(formJson["latitude"]);
        setLon(formJson["longitude"]);
    }

    return (
        <>
        <form onSubmit={updateLoc}>
        <h1>Departures</h1>
        <label>
          Latitude: <input name="latitude" defaultValue="51.5072" />
        </label>
        <br></br><br></br>
        <label>
          Longitude: <input name="longitude" defaultValue="-0.1276" />
        </label>

        <p>
          Radio buttons:
          <label>
            <input type="radio" name="myRadio" value="option1" />
            Option 1
          </label>
          <label>
            <input type="radio" name="myRadio" value="option2" />
            Option 2
          </label>
          <label>
            <input type="radio" name="myRadio" value="option3" />
            Option 3
          </label>
        </p>

        <button type="submit">Submit</button>
        </form>
        
      </>
    )
}