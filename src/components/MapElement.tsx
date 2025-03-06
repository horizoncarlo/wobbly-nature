import { useEffect, useRef } from 'react';
import './css/MapElement.css';

export type MapElementType = {
  id?: string,
  eleKey?: number,
  x: number,
  y: number
}

// Do all sorts of movement - spontanteous "charges" across the map, times sitting idle (day vs night?), fear running away, going in circles like a wolf pack, etc.
const speed = 75;
const restChance = 0.2;

export default function MapElement({ id, x, y }: MapElementType) {
  const ele = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const eleInterval = setInterval(() => {
      if (Math.random() <= restChance) {
        // Take a rest
        return;
      }
      
      if (ele?.current) {
        // Use translate3d here instead of translate in the hope it triggers GPU hardware acceleration on some browsers and setups
        ele.current.style.transform = `translate3d(${(Math.random() > 0.5 ? 1 : -1)*Math.random() * speed}px, ${(Math.random() > 0.5 ? 1 : -1)*Math.random() * speed}px, 0)`;
      }
    }, 1000); // TODO Interval for movement based on the element instead of a set 1s?
    return () => {
      if (eleInterval) {
        clearInterval(eleInterval);
      }
    }
  }, []);
  
  return (
    <div ref={ele} id={id} className="e" style={{left: x, top: y}}>
    </div>
  );
}