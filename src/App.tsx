import "./App.css";
import Creator from "./components/Creator";
import Map from "./components/Map";

export default function App() {
  return (
    <>
      <div className="overlay"></div>
      <Creator></Creator>
      <Map></Map>
    </>
  );
}
