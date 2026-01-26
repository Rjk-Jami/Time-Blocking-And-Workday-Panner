"use client";

import { useMemo } from "react";
import { useBlockStore } from "@/features/blocks/blockStore";

export default function CompletionRing() {
  const { blocks } = useBlockStore();

  const pct = useMemo(() => {
    if (blocks.length === 0) return 0;
    const done = blocks.filter((b) => b.completed).length;
    return Math.round((done / blocks.length) * 100);
  }, [blocks]);

  return (
    <div className="rounded-2xl border p-4">
      <div className="font-medium">Daily completion</div>
      <div className="mt-3 text-5xl font-semibold">{pct}%</div>
      <p className="text-neutral-600 mt-2 text-sm">
        (We’ll animate this with GSAP in progress.anim.ts)
      </p>
    </div>
  );
}
