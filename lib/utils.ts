import type { MuscleGroup } from "@/lib/types";

export const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// YYYY-MM-DD en horario local.
export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Lunes de la semana de la fecha dada.
export function weekStart(d: Date = new Date()): string {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0 = lunes
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return todayKey(date);
}

export function daysBetween(a: string, b: string): number {
  const d1 = new Date(a + "T00:00:00");
  const d2 = new Date(b + "T00:00:00");
  return Math.round((d2.getTime() - d1.getTime()) / 86400000);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  pecho: "Pecho",
  pecho_superior: "Pecho superior",
  espalda: "Espalda",
  dorsal: "Dorsales",
  trapecio: "Trapecio",
  hombro_lateral: "Hombro lateral",
  hombro_posterior: "Hombro posterior",
  hombro_frontal: "Hombro frontal",
  biceps: "Bíceps",
  triceps: "Tríceps",
  cuadriceps: "Cuádriceps",
  femoral: "Femoral",
  gluteo: "Glúteos",
  aductor: "Aductores",
  abductor: "Abductores",
  gemelo: "Gemelos",
  core: "Core",
  movilidad: "Movilidad",
};

export const muscleLabel = (m: MuscleGroup): string => MUSCLE_LABELS[m] ?? m;

export function repsLabel(reps: number, repsMax?: number): string {
  return repsMax && repsMax !== reps ? `${reps}-${repsMax}` : `${reps}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function round05(n: number): number {
  return Math.round(n * 2) / 2;
}
