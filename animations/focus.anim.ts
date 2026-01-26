"use client";

import { getGSAP } from "./gsapClient";

export function playFocusEnter(root: HTMLElement) {
  const gsap = getGSAP();
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.25 }).fromTo(
    root.querySelector("[data-focus-card]"),
    { y: 10, scale: 0.98, opacity: 0 },
    { y: 0, scale: 1, opacity: 1, duration: 0.45 },
    0.05,
  );

  return tl;
}

export function playFocusExit(root: HTMLElement) {
  const gsap = getGSAP();
  return gsap.to(root, { opacity: 0, duration: 0.2, ease: "power2.in" });
}
