import Sammy from "../img/sammy.jpeg"
import "../css/main.css"

export default function Welcome() {
return (
    <>
    <div className="wrapper">
    <h1>Welcome To My App</h1>
    <p>Default template text</p>
    <img src={Sammy} alt="Sammy Image" width={200} height={200} />
    </div>
    </>
    );
}