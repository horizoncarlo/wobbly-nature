import { memo, useCallback, useEffect, useState } from "react";
import { constants } from "../constants/constants";
import { utils } from "../utils/util";
import "./css/Map.css";
import MapElement, { ElementTypes, MapElementType } from "./MapElement";
import createMapElement from "./MapElementUtil";

const MemoizedMapElement = memo(MapElement); // Prevent the entire element list from re-rendering when adding a new item

export default function Map() {
  const [elements, setElements] = useState<MapElementType[]>([]);

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
          div1.style.backgroundColor = utils.getRandomColor();
          div2.style.backgroundColor = utils.getRandomColor();

          const ele1 = getMapElementById(div1.id);
          const ele2 = getMapElementById(div2.id);

          if (
            ele1.type === ElementTypes.CARNIVORE &&
            ele2.type === ElementTypes.HERBIVORE
          ) {
            // TTODO
            updateMapElement(ele2.id, {
              healthCurrent: ele2.healthCurrent - ele1.eatDamage,
            });
          } else if (
            ele2.type === ElementTypes.CARNIVORE &&
            ele1.type === ElementTypes.HERBIVORE
          ) {
            updateMapElement(ele1.id, {
              healthCurrent: ele1.healthCurrent - ele2.eatDamage,
            });
          }
        }
      }
    }
  });

  const getMapElementById = useCallback((id: string): MapElementType => {
    return elements.find((ele) => ele.id === id) as MapElementType;
  }, [elements]);

  const updateMapElement = useCallback(
    (id: string, updatedProps: Partial<MapElementType>) => {
      setElements((prevElements) =>
        prevElements.map((el) => el.id === id ? { ...el, ...updatedProps } : el)
      );
    },
    [],
  );

  useEffect(() => {
    const intervalId = setInterval(
      checkCollisions,
      constants.cycleInterval - 10,
    );

    return () => clearInterval(intervalId);
  }, [checkCollisions]);

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
                // TODO Would also trigger some kind of "this element was removed" event to ensure our total counts are consistent
                setElements((prevElements) =>
                  prevElements.filter((e) => e.id !== elementNode.id)
                );
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
  }, [elements]);

  const handleMapClick = useCallback((e) => {
    const genType = Math.random() < 0.5
      ? ElementTypes.HERBIVORE
      : ElementTypes.CARNIVORE;

    setElements((prevElements) => [
      ...prevElements,
      // Specifically center the elements once their size is factored in
      createMapElement({
        type: genType, // TTODO Determine type based on CreatorButton
        x: e.clientX - constants.elementWidth / 2,
        y: e.clientY - constants.elementHeight / 2,
        chanceIdle: 10,
        chanceFrolick: 10,
        chanceRush: 10,
        speedMin: 20,
        speedMax: 50,
        eatDamage: 10,
      }),
    ]);
  }, []);

  return (
    <div onClick={handleMapClick} className="map">
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
  );
}
