import { useAtom } from "jotai";
import { MouseEvent, useCallback } from "react";
import { createQueue } from "../utils/atoms";

export default function CreatorButton({ text }) {
  const [currentQueue, setCurrentQueue] = useAtom(createQueue);

  const clickCreate = useCallback((e: MouseEvent) => {
    // Automatically modify the queue size to 10 if Shift is held, 5 is Ctrl is, otherwise just 1
    const toAddLength = e.shiftKey ? 10 : (e.ctrlKey ? 5 : 1);
    const toAdd = Array.from({ length: toAddLength }, () => text);
    setCurrentQueue((prevQueue) => [
      ...prevQueue,
      ...toAdd,
    ]);
  }, [text, setCurrentQueue]);

  // TODO Change creator button backgroundColor based on herbivore (green) vs carnivore (red) vs producer (yellow) vs whatever else we add
  return <button onClick={clickCreate}>{text}</button>;
}
