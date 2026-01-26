"use client";

import { ReactNode, useEffect } from "react";
import { useMotionPrefsStore } from "@/animations/useMotionPrefs";
import { useBlockStore } from "@/features/blocks/blockStore";
import { useWorkHoursStore } from "@/features/settings/workHoursStore";

const LS_BLOCKS = "tb_blocks_v1";
const LS_WORKHOURS = "tb_workhours_v1";
const LS_MOTION = "tb_motion_v1";

export default function Providers({ children }: { children: ReactNode }) {
  const { setReduced, reducedMotion } = useMotionPrefsStore();
  const { blocks, hydrate: hydrateBlocks } = useBlockStore();
  const {
    workStartMin,
    workEndMin,
    hydrate: hydrateWorkHours,
  } = useWorkHoursStore();

  // 1) Hydrate once
  useEffect(() => {
    // motion: system preference first
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applySystem = () => setReduced(mq.matches);
    applySystem();

    // then override if user stored preference exists
    try {
      const raw = localStorage.getItem(LS_MOTION);
      if (raw != null) setReduced(Boolean(JSON.parse(raw)));
    } catch {}

    mq.addEventListener?.("change", applySystem);
    return () => mq.removeEventListener?.("change", applySystem);
  }, [setReduced]);

  useEffect(() => {
    try {
      const rawBlocks = localStorage.getItem(LS_BLOCKS);
      if (rawBlocks) hydrateBlocks(JSON.parse(rawBlocks));
    } catch {}

    try {
      const rawWH = localStorage.getItem(LS_WORKHOURS);
      if (rawWH) {
        const v = JSON.parse(rawWH) as {
          workStartMin: number;
          workEndMin: number;
        };
        if (
          typeof v.workStartMin === "number" &&
          typeof v.workEndMin === "number"
        ) {
          hydrateWorkHours(v.workStartMin, v.workEndMin);
        }
      }
    } catch {}
  }, [hydrateBlocks, hydrateWorkHours]);

  // 2) Persist on changes
  useEffect(() => {
    try {
      localStorage.setItem(LS_BLOCKS, JSON.stringify(blocks));
    } catch {}
  }, [blocks]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LS_WORKHOURS,
        JSON.stringify({ workStartMin, workEndMin }),
      );
    } catch {}
  }, [workStartMin, workEndMin]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_MOTION, JSON.stringify(reducedMotion));
    } catch {}
  }, [reducedMotion]);

  return children;
}
