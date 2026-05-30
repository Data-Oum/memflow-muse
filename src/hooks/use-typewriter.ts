import { useEffect, useState } from "react";

export function useTypewriter(
  text: string,
  speed = 18,
  start = true,
): { typed: string; done: boolean } {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    setTyped("");
    setDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, start]);

  return { typed, done };
}
