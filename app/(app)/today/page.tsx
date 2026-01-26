"use client";

import FocusModeOverlay from "@/components/timeline/FocusModeOverlay";
import Timeline from "@/components/timeline/Timeline";

export default function TodayPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Today</h1>
          <p className="text-neutral-600">Build your day with time blocks.</p>
        </div>
      </div>

      <Timeline />
      <FocusModeOverlay />
    </div>
  );
}
