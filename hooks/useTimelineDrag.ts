"use client";

import { clamp, overlaps, snapTo } from "@/features/blocks/blockMath";
import { TimeBlock } from "@/features/blocks/types";

type Params = {
  block: TimeBlock;
  allBlocks: TimeBlock[];
  dayStart: number;
  dayEnd: number;
  pxHeight: number;
  snapStepMin: number;
};

export function createMoveBlockDrag({
  block,
  allBlocks,
  dayStart,
  dayEnd,
  pxHeight,
  snapStepMin,
}: Params) {
  const pxPerMin = pxHeight / (dayEnd - dayStart);

  const isCollision = (nextStart: number, nextEnd: number) =>
    allBlocks.some((b) => {
      if (b.id === block.id) return false;
      return overlaps(nextStart, nextEnd, b.startMin, b.endMin);
    });

  return {
    compute(
      clientY: number,
      startY: number,
      startStart: number,
      duration: number,
    ) {
      const dy = clientY - startY;
      const deltaMin = dy / pxPerMin;

      let nextStart = startStart + deltaMin;
      nextStart = snapTo(nextStart, snapStepMin);

      // keep duration
      nextStart = clamp(nextStart, dayStart, dayEnd - duration);
      const nextEnd = nextStart + duration;

      if (isCollision(nextStart, nextEnd)) {
        return {
          blocked: true as const,
          nextStart: block.startMin,
          nextEnd: block.endMin,
        };
      }

      return { blocked: false as const, nextStart, nextEnd };
    },
  };
}
