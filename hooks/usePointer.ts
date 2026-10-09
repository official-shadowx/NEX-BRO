"use client";

import { useEffect, useState } from "react";

export function usePointer() {
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setPoint({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement | null;
      const interactive = Boolean(
        target?.closest("a, button, [data-cursor], input, textarea, select"),
      );
      setHovering(interactive);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return { ...point, hovering };
}
