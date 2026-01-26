"use client";

import { useMemo, useRef } from "react";
import { useBlockStore } from "@/features/blocks/blockStore";
import AddBlockPopover from "./AddBlockPopover";
import BlockItem from "./BlockItem";
import { useWorkHoursStore } from "@/features/settings/workHoursStore";

const TRACK_HEIGHT = 1200;

function fmtHHMM(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function Timeline() {
  const { blocks } = useBlockStore();
  const { workStartMin, workEndMin } = useWorkHoursStore();

  const DAY_START = workStartMin;
  const DAY_END = workEndMin;

  const wrapRef = useRef<HTMLDivElement | null>(null);

  const sorted = useMemo(
    () => [...blocks].sort((a, b) => a.startMin - b.startMin),
    [blocks],
  );

  const totalHours = Math.max(1, Math.ceil((DAY_END - DAY_START) / 60));

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Timeline</div>
        <AddBlockPopover />
      </div>

      {/* Scroll viewport */}
      <div
        ref={wrapRef}
        className="relative h-[calc(100vh-200px)] overflow-auto rounded-xl border bg-white"
      >
        {/* Track (everything positions relative to this height) */}
        <div className="relative" style={{ height: TRACK_HEIGHT }}>
          {/* hour lines */}
          <div className="absolute inset-0">
            {Array.from({ length: totalHours + 1 }).map((_, i) => {
              const top = (i / totalHours) * TRACK_HEIGHT;
              const minuteAtLine = DAY_START + i * 60;

              return (
                <div
                  key={i}
                  className="absolute left-0 right-0"
                  style={{ top }}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-14 text-xs text-neutral-500 px-2">
                      {fmtHHMM(minuteAtLine)}
                    </div>
                    <div className="h-px flex-1 bg-neutral-200" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* blocks */}
          <div className="absolute inset-0">
            {sorted.map((b) => (
              <BlockItem
                key={b.id}
                block={b}
                dayStart={DAY_START}
                dayEnd={DAY_END}
                trackHeight={TRACK_HEIGHT}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
