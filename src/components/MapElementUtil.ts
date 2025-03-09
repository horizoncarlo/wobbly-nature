import { ElementTypes, MapElementType } from "./MapElement";

export function createAnimal(name: string, x: number, y: number): MapElementType {
  return createMapElement({
    ...getPropsForAnimal(name),
    name: name,
    x: x,
    y: y,
    type: ElementTypes.CARNIVORE,
  });
}

function getPropsForAnimal(name: string): Partial<MapElementType> {
  switch (name) {
    case "Bear":
      return {
        type: ElementTypes.CARNIVORE,
        healthMax: 150,
        eatDamage: 20,
        speedMin: 5,
        speedMax: 40,
        chanceIdle: 5,
        chanceFrolick: 5,
        chanceRush: 5,
        foodNeeded: 20,
      };
    case "Fox":
      return {
        type: ElementTypes.CARNIVORE,
        healthMax: 50,
        eatDamage: 5,
        speedMin: 30,
        speedMax: 50,
        chanceIdle: 10,
        chanceFrolick: 0,
        chanceRush: 10,
        foodNeeded: 5,
      };
    case "Wolf":
      return {
        type: ElementTypes.CARNIVORE,
        healthMax: 90,
        eatDamage: 10,
        speedMin: 20,
        speedMax: 50,
        chanceIdle: 5,
        chanceFrolick: 10,
        chanceRush: 25,
        foodNeeded: 10,
      };
    case "Boar":
      return {
        type: ElementTypes.HERBIVORE,
        healthMax: 60,
        eatDamage: 10,
        speedMin: 5,
        speedMax: 20,
        chanceIdle: 20,
        chanceFrolick: 0,
        chanceRush: 10,
        foodNeeded: 10,
      };
    case "Elk":
      return {
        type: ElementTypes.HERBIVORE,
        healthMax: 80,
        eatDamage: 15,
        speedMin: 30,
        speedMax: 40,
        chanceIdle: 0,
        chanceFrolick: 5,
        chanceRush: 5,
        foodNeeded: 15,
      };
    case "Rabbit":
      return {
        type: ElementTypes.HERBIVORE,
        healthMax: 20,
        eatDamage: 5,
        speedMin: 40,
        speedMax: 65,
        chanceIdle: 15,
        chanceFrolick: 10,
        chanceRush: 5,
        foodNeeded: 10,
      };
    default:
      throw new Error("Unknown " + name);
  }

  return {
    type: ElementTypes.CARNIVORE,
    //   type: genType, // TTODO Determine type based on CreatorButton
    //   x: e.clientX - constants.elementWidth / 2,
    //   y: e.clientY - constants.elementHeight / 2,
    //   chanceIdle: 10,
    //   chanceFrolick: 10,
    //   chanceRush: 10,
    //   speedMin: 20,
    //   speedMax: 50,
    //   eatDamage: 10,
    //   healthRecover: 0.5,
    // }),
  };
}

export function createMapElement(props: MapElementType): MapElementType {
  return {
    id: props.id ?? "ele-" + Math.random(),
    eleKey: props.eleKey ?? Math.random(),
    type: props.type,
    name: props.name,
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
    foodProvided: props.foodProvided ?? 0,
  };
}
