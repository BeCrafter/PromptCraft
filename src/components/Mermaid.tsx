"use client";
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  fontFamily: "inherit",
});

export const Mermaid = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [id] = useState(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && ref.current) {
      try {
        mermaid.render(id + "-svg", chart).then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        }).catch((error) => {
          console.warn("Mermaid rendering failed:", error);
          if (ref.current) {
            ref.current.innerHTML = `<pre class="text-red-400 text-xs p-2 border border-red-800 rounded bg-red-900/20 overflow-auto">${error.message || error}</pre>`;
          }
        });
      } catch (e) {
        console.error("Mermaid sync error:", e);
      }
    }
  }, [chart, id, mounted]);

  if (!mounted) {
    return <div className="my-4 h-24 bg-neutral-900/50 rounded-lg border border-neutral-800 animate-pulse flex items-center justify-center text-neutral-600 text-sm">Loading Chart...</div>;
  }

  return <div ref={ref} id={id} className="mermaid overflow-x-auto my-6 bg-neutral-900/30 p-4 rounded-lg border border-neutral-800 flex justify-center" />;
};
