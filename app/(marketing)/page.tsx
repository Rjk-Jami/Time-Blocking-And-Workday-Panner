export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Plan your workday intentionally.</h1>
      <p className="text-lg text-neutral-600 max-w-2xl">
        A time-blocking planner for professionals and remote workers. Design
        your day with blocks, protect focus time, and review what actually
        happened.
      </p>

      <div className="flex gap-3">
        <a className="px-4 py-2 rounded-xl border" href="/today">
          Open Today
        </a>
        <a className="px-4 py-2 rounded-xl border" href="/templates">
          Browse Templates
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-4 pt-6">
        {[
          {
            t: "Visual timeline",
            d: "See your day as time blocks, not a messy list.",
          },
          { t: "Focus mode", d: "One task. Minimal UI. Stay locked in." },
          { t: "Daily summary", d: "Close the day with clarity and insights." },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border p-4">
            <div className="font-semibold">{c.t}</div>
            <div className="text-neutral-600 mt-1">{c.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
