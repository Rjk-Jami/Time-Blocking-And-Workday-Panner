"use client";

import CompletionRing from "@/components/insights/CompletionRing";
import StatsCards from "@/components/insights/StatsCards";

export default function InsightsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Insights</h1>
      <p className="text-neutral-600">
        Lightweight metrics that reveal patterns.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <CompletionRing />
        <StatsCards />
      </div>
    </div>
  );
}
