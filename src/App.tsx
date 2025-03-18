import "./App.css";
import Creator from "./components/Creator";
import Map from "./components/Map";
import { constants } from "./constants/constants";

export default function App() {
  // Set our element width/height from our JS constants
  document.documentElement.style.setProperty(
    "--element-width",
    constants.elementWidth + "px",
  );
  document.documentElement.style.setProperty(
    "--element-height",
    constants.elementHeight + "px",
  );

  return (
    <>
      <div className="overlay"></div>
      <Creator></Creator>
      <Map></Map>
    </>
  );
}
