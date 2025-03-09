import { atom } from "jotai";
import { constants } from "../constants/constants";
import CreatorButton from "./CreatorButton";
import "./css/Creator.css";

export default function Creator() {
  const createQueue = atom([]);

  return (
    <div className="creator-wrap">
      {constants.animals.map((animal) => <CreatorButton key={animal} text={animal}></CreatorButton>)}
    </div>
  );
}
