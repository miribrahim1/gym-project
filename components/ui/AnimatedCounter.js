"use client";

import { useEffect, useRef, useState } from "react";

// Parses values like "2.5K+", "50K+", "10+" into a numeric target plus the
// surrounding prefix/suffix, so we can count up numerically then re-apply
// the original formatting on the final frame.
function parseValue(raw) {
  const match = raw.match(/^([^\d]*)([\d.]+)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: raw, decimals: 0 };
  const [, prefix, numberStr, suffix] = match;
  const decimals = numberStr.includes(".") ? numberStr.split(".")[1].length : 0;
  return { prefix, number: parseFloat(numberStr), suffix, decimals };
}

export default function AnimatedCounter({ value, duration = 1600, delay = 0 }) {
  const { prefix, number, suffix, decimals } = parseValue(value);
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const timeoutId = setTimeout(() => {
            const startTime = performance.now();
            function tick(now) {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(number * eased);
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          }, delay);
          observer._timeoutId = timeoutId;
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => {
      clearTimeout(observer._timeoutId);
      observer.disconnect();
    };
  }, [number, duration, delay]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
