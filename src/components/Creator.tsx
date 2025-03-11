import { constants } from "../constants/constants";
import CreatorButton from "./CreatorButton";
import "./css/Creator.css";

export default function Creator() {
  return (
    // TODO Add hotkeys for each CreatorButton per animal
    <div className="creator-wrap">
      {constants.animals.map((animal) => <CreatorButton key={animal} text={animal}></CreatorButton>)}
    </div>
  );
}
