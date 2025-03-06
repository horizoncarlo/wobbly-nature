import CreatorButton from "./CreatorButton";
import './css/Creator.css';

// TODO Need plants as placeable food sources
// TODO Eventually need humans and idle garbage creation when placed - can almost do a pseudo-city builder?
const animals = [
  'Elk',
  'Bear',
  'Wolf',
  'Fox',
  'Boar',
  'Rabbit'
];

// TODO Change cursor when selecting an animal to place
// TODO Allow queueing multiple animals - so you can press "Elk" 5 times then your next 5 map clicks are Elk, for example
// TODO Limit population not by a forced cap, but instead by a lack of places to sleep and live - aka randomly start killing animals at X number onscreen (based on density of animals - screen size / animal size = some num?)
export default function Creator() {
  return (
    <div className="creator-wrap">
      {animals.map(animal => <CreatorButton key={animal} text={animal}></CreatorButton>)}
    </div>
  );
}