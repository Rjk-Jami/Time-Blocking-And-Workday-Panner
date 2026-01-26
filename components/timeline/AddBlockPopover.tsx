"use client";

import { useMemo, useState } from "react";
import { useBlockStore } from "@/features/blocks/blockStore";
import { TimeBlock } from "@/features/blocks/types";
import { useWorkHoursStore } from "@/features/settings/workHoursStore";
import { findNextAvailableSlot } from "@/features/blocks/findSlot";

function uid() {
  return Math.random().toString(16).slice(2);
}

function currentMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export default function AddBlockPopover() {
  const { blocks, addBlock } = useBlockStore();
  const { workStartMin, workEndMin } = useWorkHoursStore();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<TimeBlock["type"]>("task");
  const [duration, setDuration] = useState(60);
  const [msg, setMsg] = useState<string | null>(null);

  const suggested = useMemo(() => {
    const now = currentMinutes();
    return findNextAvailableSlot({
      blocks,
      desiredStartMin: now,
      durationMin: duration,
      workStartMin,
      workEndMin,
      stepMin: 15,
    });
  }, [blocks, duration, workStartMin, workEndMin]);

  const onAdd = () => {
    setMsg(null);

    const name = title.trim();
    if (!name) {
      setMsg("Please enter a block name.");
      return;
    }
    if (!suggested) {
      setMsg("No available slot within working hours.");
      return;
    }

    const b: TimeBlock = {
      id: uid(),
      title: name,
      type,
      startMin: suggested.startMin,
      endMin: suggested.endMin,
      completed: false,
    };

    addBlock(b);
    setTitle("");
    setMsg("Added ✅");
    setTimeout(() => setMsg(null), 1200);
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col">
        <label className="text-xs text-neutral-600">Block name</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Deep work"
          className="border rounded-lg px-2 py-2 w-56"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-neutral-600">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="border rounded-lg px-2 py-2"
        >
          <option value="task">Task</option>
          <option value="focus">Focus</option>
          <option value="meeting">Meeting</option>
          <option value="break">Break</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-neutral-600">Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="border rounded-lg px-2 py-2"
        >
          <option value={30}>30m</option>
          <option value={45}>45m</option>
          <option value={60}>60m</option>
          <option value={90}>90m</option>
          <option value={120}>120m</option>
        </select>
      </div>

      <button className="px-3 py-2 rounded-xl border" onClick={onAdd}>
        + Add block
      </button>

      <div className="text-sm text-neutral-600">
        {suggested ? (
          <span>
            Next slot:{" "}
            <b>
              {Math.floor(suggested.startMin / 60)}:
              {String(suggested.startMin % 60).padStart(2, "0")}
            </b>{" "}
            –{" "}
            <b>
              {Math.floor(suggested.endMin / 60)}:
              {String(suggested.endMin % 60).padStart(2, "0")}
            </b>
          </span>
        ) : (
          <span>No slot available</span>
        )}
      </div>

      {msg ? (
        <div className="w-full text-sm text-neutral-700">{msg}</div>
      ) : null}
    </div>
  );
}
