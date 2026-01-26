"use client";

import TemplateCard from "@/components/templates/TemplateCard";
import { templates } from "@/features/templates/templates.data";

export default function TemplatesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Templates</h1>
      <p className="text-neutral-600">
        Start fast with a proven workday structure.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
    </div>
  );
}
