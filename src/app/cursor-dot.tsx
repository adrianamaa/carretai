"use client";

import { useEffect, useRef } from "react";

export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.("textarea, input")) {
        el.style.opacity = "0";
        return;
      }
      const interactive = target?.closest?.("button, a, label, summary");
      el.style.opacity = "1";
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(${interactive ? 2 : 1})`;
    };
    const hide = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  }, []);

  return <div ref={ref} className="cursor-dot" aria-hidden />;
}
