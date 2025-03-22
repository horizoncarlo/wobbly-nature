import { useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { constants } from "../constants/constants";
import { mapElements } from "../utils/atoms";
import { utils } from "../utils/util";
import "./css/MapElement.css";
import { createAnimal } from "./MapElementUtil";

export const ElementTypes = {
  HERBIVORE: "herbivore",
  CARNIVORE: "carnivore",
  PRODUCER: "producer",
} as const;
export type MapElementType = {
  id?: string;
  eleKey?: number; // Used as a React "key" when included in the page
  type: typeof ElementTypes[keyof typeof ElementTypes];
  name?: string;
  x?: number;
  y?: number;
  healthMax?: number;
  healthCurrent?: number; // Reach 0 and be destroyed
  healthRecover?: number; // Amount of health recovered per cycle
  eatDamage?: number; // TTODO Should eatDamage have min/max range?
  speedMin?: number;
  speedMax?: number;
  chanceIdle?: number;
  chanceFrolick?: number;
  chanceRush?: number;
  foodNeeded?: number; // Amount of food per cycle
  foodCurrent?: number;
  foodProvided?: number;
  growChance?: number; // Percent chance to replicate self
  growCap?: number; // How many elements to stop growing at, to prevent spiraling out of control
  imgWidth?: number;
  imgHeight?: number;
  imgFolder?: "anim" | "static";
  imgExt?: "gif" | "png";
};

export default function MapElement({
  // TODO Bad duplication with MapElementUtils.createMapElement
  id = "ele-" + Math.random(),
  eleKey = Math.random(),
  type,
  name,
  x = 0,
  y = 0,
  healthMax = 1,
  healthCurrent = healthMax ?? 1,
  healthRecover = 0,
  eatDamage = 0,
  speedMin = 0,
  speedMax = 0,
  chanceIdle = 0,
  chanceFrolick = 0,
  chanceRush = 0,
  foodNeeded = 0,
  foodCurrent = 0,
  foodProvided = 0,
  growChance = 0,
  growCap = 20,
  imgWidth = constants.elementWidth,
  imgHeight = constants.elementHeight,
  imgFolder = "anim",
  imgExt = "gif",
}: MapElementType) {
  const setElements = useSetAtom(mapElements);
  const eleDiv = useRef<HTMLDivElement>(null);
  const eleImg = useRef<HTMLImageElement>(null);
  const nameLowerCase = name?.toLowerCase();
  const [isIdle, setIsIdle] = useState<boolean>(true); // TODO Could also have a third animation of "charge" which would be `run` version of our animals

  const performMovement = useCallback(() => {
    if (speedMin === 0 && speedMax === 0) {
      return;
    }

    // Special movements - the priority of which is we check idle, frolick, then rush
    if (chanceIdle > 0 && utils.getPercentFired(chanceIdle)) {
      setIsIdle(true);
      return;
    }

    let currentSpeedX = utils.getRandomRange(speedMin, speedMax);
    let currentSpeedY = utils.getRandomRange(speedMin, speedMax);
    if (chanceFrolick > 0 && utils.getPercentFired(chanceIdle)) {
      currentSpeedX /= 2;
      currentSpeedY /= 2;
    } else if (chanceRush > 0 && utils.getPercentFired(chanceIdle)) {
      currentSpeedX *= 2;
      currentSpeedY *= 2;
    }
    setIsIdle(false);

    // Reverse our direction randomly
    const flippedX = utils.getRandomModifier();
    currentSpeedX = flippedX * currentSpeedX;
    currentSpeedY = (utils.getRandomModifier()) * currentSpeedY;

    if (eleDiv?.current) {
      // Use translate3d here instead of translate in the hope it triggers GPU hardware acceleration on some browsers and setups
      eleDiv.current.style.transform = `translate3d(${currentSpeedX}px, ${currentSpeedY}px, 0)`;
    }
    if (eleImg?.current) {
      // Flip our direction so our image facing matches
      eleImg.current.style.transform = `scaleX(${flippedX * -1})`;
    }
  }, [chanceIdle, chanceFrolick, chanceRush, speedMin, speedMax]);

  const performGrowth = useCallback(() => {
    if (growChance > 0 && utils.getPercentFired(growChance)) {
      setElements((prevElements) => {
        const matchingElementsCount = prevElements.filter((ele) => ele.name === name).length;
        if (matchingElementsCount >= growCap) {
          return prevElements;
        }

        const newAnimal = createAnimal(name as string);
        const newX = utils.getRandomRange(
          x + ((newAnimal.imgWidth ?? constants.elementWidth) * utils.getRandomModifier()),
          x + ((newAnimal.imgWidth ?? constants.elementWidth) * utils.getRandomModifier() * 2),
        );
        const newY = utils.getRandomRange(
          y + ((newAnimal.imgHeight ?? constants.elementHeight) * utils.getRandomModifier()),
          y + ((newAnimal.imgHeight ?? constants.elementHeight) * utils.getRandomModifier() * 2),
        );
        newAnimal.x = newX;
        newAnimal.y = newY;

        return [...prevElements, newAnimal];
      });
    }
  }, [growChance, growCap, name, x, y, setElements]);

  useEffect(() => {
    // Perform our cycle
    const eleInterval = setInterval(() => {
      performMovement();
      performGrowth();
      // TODO Each animal having it's own cycle speed looks even more realistic: }, utils.getRandomRange(constants.cycleInterval/4, constants.cycleInterval));
    }, constants.cycleInterval);

    return () => {
      if (eleInterval) {
        clearInterval(eleInterval);
      }
    };
  }, [performMovement, performGrowth]);

  // TODO z-index for layering animals vs producers and so on
  return (
    <div ref={eleDiv} id={id} className={`e e${imgWidth} e${imgHeight}`} style={{ left: x, top: y }}>
      <img
        ref={eleImg}
        draggable="false"
        src={`${import.meta.env.BASE_URL}./assets/${imgFolder}/${nameLowerCase}${(imgFolder === "anim" && isIdle) ? "_idle" : ""}.${imgExt}`}
        className={`${speedMin === 0 && speedMax === 0 && utils.getRandomBoolean() ? "f" : ""}`}
      >
      </img>
    </div>
  );
}
