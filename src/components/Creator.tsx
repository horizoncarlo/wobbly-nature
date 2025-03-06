import CreatorButton from "./CreatorButton";
import './css/Creator.css';

const animals = [
  'Elk',
  'Bear',
  'Wolf',
  'Fox',
  'Boar',
  'Rabbit'
];

export default function Creator() {
  return (
    <div className="creator-wrap">
      {animals.map(animal => <CreatorButton key={animal} text={animal}></CreatorButton>)}
    </div>
  );
}