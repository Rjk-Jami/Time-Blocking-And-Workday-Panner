"use client";

import { useBlockStore } from "@/features/blocks/blockStore";

export default function StatsCards() {
  const { blocks } = useBlockStore();

  const focusMins = blocks
    .filter((b) => b.type === "focus")
    .reduce((acc, b) => acc + (b.endMin - b.startMin), 0);

  return (
    <div className="rounded-2xl border p-4 space-y-2">
      <div className="font-medium">Stats</div>
      <div className="text-neutral-700">
        Focus time: {Math.round(focusMins / 60)}h
      </div>
      <div className="text-neutral-700">Blocks: {blocks.length}</div>
      <div className="text-sm text-neutral-600">
        (More insights coming next)
      </div>
    </div>
  );
}
