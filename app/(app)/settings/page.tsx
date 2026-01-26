"use client";

import { useState } from "react";
import { useMotionPrefsStore } from "@/animations/useMotionPrefs";
import { useWorkHoursStore } from "@/features/settings/workHoursStore";

function toMin(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function SettingsPage() {
  const { reducedMotion, setReduced } = useMotionPrefsStore();
  const { workStartMin, workEndMin, setWorkHours } = useWorkHoursStore();

  const [start, setStart] = useState(toHHMM(workStartMin));
  const [end, setEnd] = useState(toHHMM(workEndMin));
  const [msg, setMsg] = useState<string | null>(null);

  const save = () => {
    const s = toMin(start);
    const e = toMin(end);

    if (Number.isNaN(s) || Number.isNaN(e)) {
      setMsg("Invalid time.");
      return;
    }
    if (e <= s) {
      setMsg("End time must be after start time.");
      return;
    }
    setWorkHours(s, e);
    setMsg("Saved working hours ✅");
    setTimeout(() => setMsg(null), 1500);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="rounded-2xl border p-4 space-y-3">
        <div className="font-medium">Working hours (master)</div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <div className="text-neutral-600 mb-1">Start</div>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border rounded-lg px-2 py-1"
            />
          </label>

          <label className="text-sm">
            <div className="text-neutral-600 mb-1">End</div>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border rounded-lg px-2 py-1"
            />
          </label>

          <button onClick={save} className="px-3 py-2 rounded-xl border">
            Save
          </button>
        </div>

        {msg ? <div className="text-sm text-neutral-700">{msg}</div> : null}

        <p className="text-sm text-neutral-600">
          These hours are used when creating blocks and for timeline boundaries.
        </p>
      </div>

      <div className="rounded-2xl border p-4 space-y-2">
        <div className="font-medium">Motion</div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => setReduced(e.target.checked)}
          />
          Reduce animations
        </label>
      </div>
    </div>
  );
}
