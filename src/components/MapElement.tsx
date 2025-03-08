import { useEffect, useRef } from "react";
import { constants } from "../constants/constants";
import { utils } from "../utils/util";
import "./css/MapElement.css";

export const ElementTypes = {
  HERBIVORE: "herbivore",
  CARNIVORE: "carnivore",
  PRODUCER: "producer",
} as const;
export type MapElementType = {
  id?: string;
  eleKey?: number; // Used as a React "key" when included in the page
  type: typeof ElementTypes[keyof typeof ElementTypes];
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
};

export default function MapElement({
  // TODO Bad duplication with MapElementUtils.createMapElement
  id = "ele-" + Math.random(),
  eleKey = Math.random(),
  type,
  x = 0,
  y = 0,
  healthMax = 1,
  healthCurrent = 1,
  healthRecover = 0,
  eatDamage = 0,
  speedMin = 0,
  speedMax = 0,
  chanceIdle = 0,
  chanceFrolick = 0,
  chanceRush = 0,
  foodNeeded = 0,
  foodCurrent = 0,
}: MapElementType) {
  const ele = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eleInterval = setInterval(() => {
      let currentSpeedX = utils.getRandomRange(speedMin, speedMax);
      let currentSpeedY = utils.getRandomRange(speedMin, speedMax);

      // Special movements - the priority of which is we check idle, frolick, then rush
      if (chanceIdle > 0 && utils.getPercentFired(chanceIdle)) {
        return;
      } else if (chanceFrolick > 0 && utils.getPercentFired(chanceIdle)) {
        currentSpeedX /= 2;
        currentSpeedY /= 2;
      } else if (chanceRush > 0 && utils.getPercentFired(chanceIdle)) {
        currentSpeedX *= 2;
        currentSpeedY *= 2;
      }

      // Reverse our direction randomly
      currentSpeedX = (Math.random() > 0.5 ? 1 : -1) * currentSpeedX;
      currentSpeedY = (Math.random() > 0.5 ? 1 : -1) * currentSpeedY;

      if (ele?.current) {
        // Use translate3d here instead of translate in the hope it triggers GPU hardware acceleration on some browsers and setups
        ele.current.style.transform =
          `translate3d(${currentSpeedX}px, ${currentSpeedY}px, 0)`;
      }
    }, constants.cycleInterval);
    return () => {
      if (eleInterval) {
        clearInterval(eleInterval);
      }
    };
  }, []);

  return (
    <div ref={ele} id={id} className="e" style={{ left: x, top: y }}>
      {type.substring(0, 1)}-{healthCurrent}
    </div>
  );
}
