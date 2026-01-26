"use client";

import { useBlockStore } from "@/features/blocks/blockStore";
import { TimeBlock } from "@/features/blocks/types";

type Template = { id: string; name: string; description: string };

function uid() {
  return Math.random().toString(16).slice(2);
}

export default function TemplateCard({ template }: { template: Template }) {
  const { setBlocks } = useBlockStore();

  const apply = () => {
    const blocks: TimeBlock[] =
      template.id === "t1"
        ? [
            {
              id: uid(),
              title: "Deep Work",
              type: "focus",
              startMin: 9 * 60,
              endMin: 11 * 60,
              completed: false,
            },
            {
              id: uid(),
              title: "Admin",
              type: "task",
              startMin: 11 * 60,
              endMin: 12 * 60,
              completed: false,
            },
            {
              id: uid(),
              title: "Deep Work",
              type: "focus",
              startMin: 13 * 60,
              endMin: 15 * 60,
              completed: false,
            },
          ]
        : [
            {
              id: uid(),
              title: "Meetings",
              type: "meeting",
              startMin: 9 * 60,
              endMin: 12 * 60,
              completed: false,
            },
            {
              id: uid(),
              title: "Follow-ups",
              type: "task",
              startMin: 13 * 60,
              endMin: 15 * 60,
              completed: false,
            },
          ];

    setBlocks(blocks);
  };

  return (
    <div className="rounded-2xl border p-4">
      <div className="font-semibold">{template.name}</div>
      <div className="text-neutral-600 mt-1">{template.description}</div>
      <button className="mt-3 px-3 py-2 rounded-xl border" onClick={apply}>
        Apply
      </button>
    </div>
  );
}
