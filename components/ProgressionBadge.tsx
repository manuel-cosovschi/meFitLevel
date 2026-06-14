"use client";

import type { ProgressionSuggestion } from "@/lib/types";
import { Pill } from "@/components/ui";

const META: Record<
  ProgressionSuggestion["action"],
  { tone: "green" | "blue" | "amber" | "red" | "violet"; icon: string; label: string }
> = {
  subir: { tone: "green", icon: "▲", label: "Subir" },
  mantener_subir_reps: { tone: "blue", icon: "→", label: "Más reps" },
  mantener: { tone: "blue", icon: "→", label: "Mantener" },
  bajar: { tone: "amber", icon: "▼", label: "Bajar" },
  deload: { tone: "red", icon: "✚", label: "Deload" },
};

export default function ProgressionBadge({ suggestion }: { suggestion: ProgressionSuggestion }) {
  const m = META[suggestion.action];
  return (
    <Pill tone={m.tone}>
      <span>{m.icon}</span>
      {m.label} · {suggestion.newWeight}kg
    </Pill>
  );
}
