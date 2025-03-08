import { MapElementType } from "./MapElement";

export default function createMapElement(props: MapElementType) {
  return {
    id: props.id ?? "ele-" + Math.random(),
    eleKey: props.eleKey ?? Math.random(),
    type: props.type,
    x: props.x ?? 0,
    y: props.y ?? 0,
    healthMax: props.healthMax ?? 100,
    healthCurrent: props.healthCurrent ?? 100,
    healthRecover: props.healthRecover ?? 0,
    eatDamage: props.eatDamage ?? 0,
    speedMin: props.speedMin ?? 0,
    speedMax: props.speedMax ?? 0,
    chanceIdle: props.chanceIdle ?? 0,
    chanceFrolick: props.chanceFrolick ?? 0,
    chanceRush: props.chanceRush ?? 0,
    foodNeeded: props.foodNeeded ?? 0,
    foodCurrent: props.foodCurrent ?? 0,
  };
}
