import { memo, useCallback, useEffect, useState } from "react";
import { constants } from "../constants/constants";
import './css/Map.css';
import MapElement, { MapElementType } from "./MapElement";

const MemoizedMapElement = memo(MapElement); // Prevent the entire element list from re-rendering when adding a new item

export default function Map() {
  const [elements, setElements] = useState<MapElementType[]>([]);
  
  // TODO Slightly more performant, but also looks too robotic instead of each element having it's own interval
  // const moveThem = useEffect(() => {
  //   const eleInterval = setInterval(() => {
  //     [...document.getElementsByClassName('e')].forEach(ele => {
  //       ele.style.transform = `translate(${Math.random()*100}px, ${Math.random()*100}px)`;
  //     })
  //   }, 1000);
  //   return () => {
  //     if (eleInterval) {
  //       clearInterval(eleInterval);
  //     }
  //   }
  // }, []);
  
  // Determine if any of our MapElements went offscreen, using an intersection observer
  // If they did we remove them entirely
  // Also very impressively this automatically handles a resized/changed browser
  // So for example opening web dev tools to shrink the screen will clear outside elements automatically
  // Really living in 2099
  useEffect(() => {
    const observers = [...document.getElementsByClassName('e')].map(elementNode => {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            // TODO Would also trigger some kind of "this element was removed" event to ensure our total counts are consistent
            setElements(prevElements => prevElements.filter(e => e.id !== elementNode.id));
            observer.disconnect();
          }
        });
      }, {
        threshold: 0.25
      });

      observer.observe(elementNode);
      return observer;
    });
    
    // Clear observers on unmount
    return () => {
      observers.forEach(obsRef => {
        if (obsRef) obsRef.disconnect();
      });
    };
  }, [elements]);
  
  const handleMapClick = useCallback((e) => {
    setElements(prevElements => [
      ...prevElements,
      // Specifically center the elements once their size is factored in
      { id: 'ele-' + Math.random(), eleKey: Math.random(), x: e.clientX - constants.elementWidth/2, y: e.clientY - constants.elementHeight/2 } as MapElementType
    ]);
  }, []);
  
  return (
    <div onClick={handleMapClick} className="map">
      {elements.map(element => <MemoizedMapElement key={element.eleKey} {...element}></MemoizedMapElement>)}
    </div>
  );
}