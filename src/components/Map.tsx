import { useAtom, useAtomValue } from "jotai";
import { memo, useCallback, useEffect, useRef } from "react";
import { constants } from "../constants/constants";
import { createQueue, mapElements } from "../utils/atoms";
import "./css/Map.css";
import MapElement, { ElementTypes, MapElementType } from "./MapElement";
import { createAnimal } from "./MapElementUtil";

const MemoizedMapElement = memo(MapElement); // Prevent the entire element list from re-rendering when adding a new item

export default function Map() {
  const currentQueue = useAtomValue(createQueue);
  const [elements, setElements] = useAtom(mapElements);
  const dayNightCounter = useRef(0);

  const recoverHealth = useCallback(() => {
    // Only update state if there's any change to prevent a global map re-render
    const updatedElements = elements.map((element) => {
      if (element.healthCurrent < element.healthMax) {
        return {
          ...element,
          healthCurrent: element.healthCurrent + element.healthRecover,
        };
      }
      return element;
    });

    if (
      updatedElements.some((element, index) => element.healthCurrent !== elements[index].healthCurrent)
    ) {
      setElements(() => {
        return updatedElements;
      });
    }
  }, [elements, setElements]);

  const checkCollisions = useCallback(() => {
    function isOverlapping(rect1, rect2) {
      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
    }

    const elementsDivs = document.querySelectorAll(".e");
    for (let i = 0; i < elementsDivs.length; i++) {
      for (let j = i + 1; j < elementsDivs.length; j++) {
        const div1 = elementsDivs[i];
        const div2 = elementsDivs[j];
        if (
          isOverlapping(
            div1.getBoundingClientRect(),
            div2.getBoundingClientRect(),
          )
        ) {
          const ele1 = getMapElementById(div1.id);
          const ele2 = getMapElementById(div2.id);

          // TTODO If we haven't found food in X cycles, then we need to drastically change our position, so go on a "migration" and go 3x our speed for X cycles or something?
          // TODO Gotta be a better way to implement this repetition - maybe an attacker vs defender generic approach?
          if (ele1 && ele2) {
            if (
              ((ele1.type === ElementTypes.CARNIVORE &&
                ele2.type === ElementTypes.HERBIVORE) ||
                (ele2.type === ElementTypes.CARNIVORE &&
                  ele1.type === ElementTypes.HERBIVORE))
            ) {
              const carnivore = ele1.type === ElementTypes.CARNIVORE ? ele1 : ele2;
              const herbivore = carnivore === ele1 ? ele2 : ele1;

              // TTODO Remove random background color on getting eaten
              (herbivore === ele1 ? div1 : div2).style.backgroundColor = "red";

              const newHealthCurrent = herbivore.healthCurrent -
                carnivore.eatDamage;
              updateMapElement(herbivore.id, {
                healthCurrent: newHealthCurrent,
              });
              updateMapElement(carnivore.id, {
                foodCurrent: carnivore.foodCurrent + herbivore.foodProvided,
              });

              if (newHealthCurrent <= 0) {
                deleteMapElement(herbivore.id);
              }
            } else if (
              (ele1.type === ElementTypes.HERBIVORE &&
                ele2.type === ElementTypes.PRODUCER) ||
              (ele2.type === ElementTypes.HERBIVORE &&
                ele1.type === ElementTypes.PRODUCER)
            ) {
              const herbivore = ele1.type === ElementTypes.HERBIVORE ? ele1 : ele2;
              const producer = herbivore === ele1 ? ele2 : ele1;

              // TTODO Remove random background color on getting eaten
              (producer === ele1 ? div1 : div2).style.backgroundColor = "red";

              const newHealthCurrent = producer.healthCurrent -
                herbivore.eatDamage;
              updateMapElement(producer.id, {
                healthCurrent: newHealthCurrent,
              });
              // TTODO Check foodCurrent vs foodNeeded every DAY/NIGHT cycle (every 30 seconds? still needs to be implemented on it's own - change background color, show sun/moon on the HUD)
              updateMapElement(herbivore.id, {
                foodCurrent: herbivore.foodCurrent + producer.foodProvided,
              });

              if (newHealthCurrent <= 0) {
                deleteMapElement(producer.id);
              }
            }
          }
        }
      }
    }
  });

  const dayNightCycle = useCallback(() => {
    dayNightCounter.current++;

    if (dayNightCounter.current % constants.dayNightRotation === 0) {
      document.body.classList.toggle("night");
    }
  }, []);

  const getMapElementById = useCallback((id: string): MapElementType => {
    return elements.find((ele) => ele.id === id) as MapElementType;
  }, [elements]);

  const updateMapElement = useCallback(
    (id: string, updatedProps: Partial<MapElementType>) => {
      setElements((prevElements) => prevElements.map((ele) => ele.id === id ? { ...ele, ...updatedProps } : ele));
    },
    [setElements],
  );

  const deleteMapElement = useCallback((id: string) => {
    // TODO Temporarily replace a dead creature with a non-moving bone / dead plant static image
    setElements((prevElements) => prevElements.filter((ele) => ele.id !== id));
  }, [setElements]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // TTODO Have a "degradeFood" function that slowly ticks down food across ALL map elements. Then hook into day/night cycle and kill them at 0 food or degrade health at >0 & <foodNeeded
      recoverHealth();
      checkCollisions();
      dayNightCycle();
    }, constants.cycleInterval - 10);

    return () => clearInterval(intervalId);
  }, [recoverHealth, checkCollisions, dayNightCycle]);

  // Determine if any of our MapElements went offscreen, using an intersection observer
  // If they did we remove them entirely
  // Also very impressively this automatically handles a resized/changed browser
  // So for example opening web dev tools to shrink the screen will clear outside elements automatically
  // Really living in 2099
  useEffect(() => {
    const observers = [...document.getElementsByClassName("e")].map(
      (elementNode) => {
        const observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                deleteMapElement(elementNode.id);
                observer.disconnect();
              }
            });
          },
          {
            threshold: 0.25,
          },
        );

        observer.observe(elementNode);
        return observer;
      },
    );

    // Clear observers on unmount
    return () => {
      observers.forEach((obsRef) => {
        if (obsRef) obsRef.disconnect();
      });
    };
  }, [elements, deleteMapElement]);

  // TTODO Hold the mouse to spam place things?
  const handleMapClick = useCallback((e) => {
    // Do nothing if we have an empty queue
    if (!currentQueue?.length) {
      console.warn(
        "No queued elements to place on the map - click one of the buttons",
      );
      return;
    }

    console.log("QUEUE IS", currentQueue); // TTODO - Show the upcoming queue somewhere on the UI (count in a corner, mouseover to see upcoming elements)? Have a "random queue" option that just puts a random element when selected and clicked on the map?

    // Specifically center the elements once their size is factored in
    const newAnimal = createAnimal(currentQueue.shift() as string);
    newAnimal.x = e.clientX - (newAnimal.imgWidth ?? constants.elementWidth) / 2;
    newAnimal.y = e.clientY - (newAnimal.imgHeight ?? constants.elementHeight) / 2;

    setElements((prevElements) => [
      ...prevElements,
      newAnimal,
    ]);
  }, [currentQueue, setElements]);

  return (
    <>
      <div onClick={handleMapClick} className="map">
        {/* TODO TEMPORARY Show number of elements in a simple way for now */}
        <div
          style={{ position: "absolute", top: 0, left: "40%" }}
          className="title-bar"
        >
          <span className="title-bar-text">Elements: {elements?.length}</span>
        </div>
        {elements.map((element) => (
          <MemoizedMapElement
            key={element.eleKey}
            {...element}
          >
          </MemoizedMapElement>
        ))}
      </div>
      {
        /* TTODO Make a warning dialog box component: <div className="window" style={{width: '300px', position: 'absolute', left: '40%', top: '40%'}}>
      <div className="title-bar">
        <div className="title-bar-text">A Window With Stuff In It</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body">
        <p>There's so much room for activities!</p>
      </div>
    </div> */
      }
    </>
  );
}
