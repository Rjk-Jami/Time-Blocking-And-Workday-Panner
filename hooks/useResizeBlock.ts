"use client";

import { useCallback, useRef } from "react";
import { clamp, overlaps, snapTo } from "@/features/blocks/blockMath";
import { TimeBlock } from "@/features/blocks/types";

type ResizeEdge = "top" | "bottom";

type Params = {
  block: TimeBlock;
  allBlocks: TimeBlock[];
  dayStart: number;
  dayEnd: number;
  pxHeight: number; // same height as timeline viewport (e.g. 560)
  snapStepMin: number; // 15 by default
  minDurationMin: number; // 15 by default
};

export function useResizeBlock({
  block,
  allBlocks,
  dayStart,
  dayEnd,
  pxHeight,
  snapStepMin,
  minDurationMin,
}: Params) {
  const draggingRef = useRef<{
    edge: ResizeEdge;
    startY: number;
    startStart: number;
    startEnd: number;
  } | null>(null);

  const pxPerMin = pxHeight / (dayEnd - dayStart);

  const minutesFromDeltaY = (dy: number) => dy / pxPerMin;

  const isCollision = useCallback(
    (nextStart: number, nextEnd: number) => {
      return allBlocks.some((b) => {
        if (b.id === block.id) return false;
        return overlaps(nextStart, nextEnd, b.startMin, b.endMin);
      });
    },
    [allBlocks, block.id],
  );

  const begin = useCallback(
    (edge: ResizeEdge, clientY: number) => {
      draggingRef.current = {
        edge,
        startY: clientY,
        startStart: block.startMin,
        startEnd: block.endMin,
      };
    },
    [block.startMin, block.endMin],
  );

  const update = useCallback(
    (clientY: number) => {
      const d = draggingRef.current;
      if (!d) return null;

      const dy = clientY - d.startY;
      const deltaMin = minutesFromDeltaY(dy);

      let nextStart = d.startStart;
      let nextEnd = d.startEnd;

      if (d.edge === "top") {
        nextStart = d.startStart + deltaMin;
        // enforce min duration
        nextStart = Math.min(nextStart, nextEnd - minDurationMin);
        nextStart = clamp(nextStart, dayStart, dayEnd - minDurationMin);
      } else {
        nextEnd = d.startEnd + deltaMin;
        nextEnd = Math.max(nextEnd, nextStart + minDurationMin);
        nextEnd = clamp(nextEnd, dayStart + minDurationMin, dayEnd);
      }

      // live update is unsnapped for responsiveness
      if (isCollision(nextStart, nextEnd)) {
        return {
          blocked: true as const,
          nextStart: block.startMin,
          nextEnd: block.endMin,
        };
      }

      return { blocked: false as const, nextStart, nextEnd };
    },
    [
      block.startMin,
      block.endMin,
      dayStart,
      dayEnd,
      minDurationMin,
      isCollision,
      minutesFromDeltaY,
    ],
  );

  const end = useCallback(
    (clientY: number) => {
      const d = draggingRef.current;
      draggingRef.current = null;
      if (!d) return null;

      // compute final, then SNAP
      const live = (() => {
        const dy = clientY - d.startY;
        const deltaMin = minutesFromDeltaY(dy);
        let nextStart = d.startStart;
        let nextEnd = d.startEnd;

        if (d.edge === "top") {
          nextStart = d.startStart + deltaMin;
          nextStart = Math.min(nextStart, nextEnd - minDurationMin);
          nextStart = clamp(nextStart, dayStart, dayEnd - minDurationMin);
        } else {
          nextEnd = d.startEnd + deltaMin;
          nextEnd = Math.max(nextEnd, nextStart + minDurationMin);
          nextEnd = clamp(nextEnd, dayStart + minDurationMin, dayEnd);
        }
        return { nextStart, nextEnd };
      })();

      let snappedStart = live.nextStart;
      let snappedEnd = live.nextEnd;

      if (d.edge === "top") {
        snappedStart = snapTo(snappedStart, snapStepMin);
        snappedStart = Math.min(snappedStart, snappedEnd - minDurationMin);
        snappedStart = clamp(snappedStart, dayStart, dayEnd - minDurationMin);
      } else {
        snappedEnd = snapTo(snappedEnd, snapStepMin);
        snappedEnd = Math.max(snappedEnd, snappedStart + minDurationMin);
        snappedEnd = clamp(snappedEnd, dayStart + minDurationMin, dayEnd);
      }

      // collision check after snapping too
      if (isCollision(snappedStart, snappedEnd)) {
        return {
          blocked: true as const,
          finalStart: d.startStart,
          finalEnd: d.startEnd,
        };
      }

      return {
        blocked: false as const,
        finalStart: snappedStart,
        finalEnd: snappedEnd,
      };
    },
    [
      clamp,
      dayStart,
      dayEnd,
      isCollision,
      minDurationMin,
      minutesFromDeltaY,
      snapStepMin,
    ],
  );

  return { begin, update, end };
}
