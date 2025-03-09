import { useAtom } from "jotai";
import { useCallback } from "react";
import { createQueue } from "../utils/atoms";

export default function CreatorButton({ text }) {
  const [currentQueue, setCurrentQueue] = useAtom(createQueue);

  const clickCreate = useCallback(() => {
    setCurrentQueue((prevQueue) => [
      ...prevQueue,
      text,
    ]);
  }, [text, currentQueue, setCurrentQueue]);

  return <button onClick={clickCreate}>{text}</button>;
}
