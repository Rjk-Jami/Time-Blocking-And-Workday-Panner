import { TimeBlock } from "./types";
import { overlaps, clamp } from "./blockMath";

type FindSlotParams = {
  blocks: TimeBlock[];
  desiredStartMin: number; // usually "now"
  durationMin: number; // e.g. 60
  workStartMin: number;
  workEndMin: number;
  stepMin: number; // e.g. 15
};

// returns null if no space
export function findNextAvailableSlot({
  blocks,
  desiredStartMin,
  durationMin,
  workStartMin,
  workEndMin,
  stepMin,
}: FindSlotParams): { startMin: number; endMin: number } | null {
  const sorted = [...blocks].sort((a, b) => a.startMin - b.startMin);

  // clamp desired start inside working hours
  let cursor = clamp(desiredStartMin, workStartMin, workEndMin - durationMin);

  // move in step increments until we find a gap
  while (cursor + durationMin <= workEndMin) {
    const candidateStart = cursor;
    const candidateEnd = cursor + durationMin;

    const collision = sorted.some((b) =>
      overlaps(candidateStart, candidateEnd, b.startMin, b.endMin),
    );

    if (!collision) return { startMin: candidateStart, endMin: candidateEnd };

    cursor += stepMin;
  }

  return null;
}
