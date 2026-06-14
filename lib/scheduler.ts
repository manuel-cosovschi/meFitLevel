import { clamp } from "@/lib/utils";

// =============================================================
// Reestructuración semanal según días disponibles (2-5).
// Prioridad cuando hay menos días:
//   1. Piernas/glúteos  2. Torso completo  3. Hombros/brazos  4. Core
// No intenta compensar todo de golpe: distribuye coherente.
// =============================================================

const PLANS: Record<number, string[]> = {
  2: ["lower_a", "torso_a"],
  3: ["torso_a", "lower_a", "torso_b"],
  4: ["torso_a", "lower_a", "torso_b", "lower_b"],
  5: ["torso_a", "lower_a", "torso_b", "lower_b", "opcional"],
};

export function planForDays(days: number): string[] {
  const d = clamp(Math.round(days), 2, 5);
  return [...PLANS[d]];
}

export const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
