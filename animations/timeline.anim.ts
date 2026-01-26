"use client";

import gsap from "gsap";

export function snapSettle(el: HTMLElement) {
  // subtle "settle" after snap to time
  return gsap.fromTo(
    el,
    { scaleY: 1.015 },
    { scaleY: 1, duration: 0.22, ease: "power2.out", clearProps: "transform" },
  );
}

export function invalidNudge(el: HTMLElement) {
  // quick feedback when collision blocks resizing
  return gsap.fromTo(
    el,
    { x: 0 },
    {
      x: 6,
      duration: 0.08,
      yoyo: true,
      repeat: 1,
      ease: "power1.out",
      clearProps: "transform",
    },
  );
}
