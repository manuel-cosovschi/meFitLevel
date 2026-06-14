import type { Achievement, Rank, Title, MuscleGroup, RPGStats } from "@/lib/types";

// =============================================================
// Constantes del sistema RPG / Solo Leveling.
// =============================================================

// Curva de niveles: XP necesaria acumulada para alcanzar un nivel.
// level N requiere baseXP * N^1.35 aprox. Simple y creciente.
export const xpForLevel = (level: number): number =>
  Math.round(100 * Math.pow(level, 1.35));

// Devuelve { level, current, needed } dado xp total.
export function levelFromXp(totalXp: number): {
  level: number;
  intoLevel: number;
  toNext: number;
  pct: number;
} {
  let level = 1;
  while (totalXp >= xpForLevel(level + 1)) level++;
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const intoLevel = totalXp - floor;
  const span = ceil - floor;
  return {
    level,
    intoLevel,
    toNext: ceil - totalXp,
    pct: Math.max(0, Math.min(100, Math.round((intoLevel / span) * 100))),
  };
}

// Rango según nivel.
export const RANK_THRESHOLDS: { rank: Rank; minLevel: number; label: string }[] = [
  { rank: "E", minLevel: 1, label: "E-Rank Hunter" },
  { rank: "D", minLevel: 5, label: "D-Rank Hunter" },
  { rank: "C", minLevel: 10, label: "C-Rank Hunter" },
  { rank: "B", minLevel: 18, label: "B-Rank Hunter" },
  { rank: "A", minLevel: 28, label: "A-Rank Hunter" },
  { rank: "S", minLevel: 40, label: "S-Rank Hunter" },
  { rank: "National", minLevel: 55, label: "National Level Hunter" },
];

export function rankFromLevel(level: number): { rank: Rank; label: string } {
  let found = RANK_THRESHOLDS[0];
  for (const t of RANK_THRESHOLDS) if (level >= t.minLevel) found = t;
  return { rank: found.rank, label: found.label };
}

// XP por acción.
export const XP = {
  completeWorkout: 50,
  logAllSets: 10,
  proteinHit: 20,
  mobility: 15,
  abs: 25,
  progressExercise: 30,
  completeWeek: 100,
  fourWorkouts: 200,
  newPr: 300,
};

// Títulos desbloqueables.
export const TITLES: Omit<Title, "unlocked">[] = [
  { id: "v_taper", name: "V-Taper Initiate" },
  { id: "dorsal_hunter", name: "Dorsal Hunter" },
  { id: "glute_builder", name: "Glute Builder" },
  { id: "iron_discipline", name: "Iron Discipline" },
  { id: "leg_day_survivor", name: "Leg Day Survivor" },
  { id: "shadow_monarch", name: "Shadow Monarch" },
];

// Logros.
export const ACHIEVEMENTS: Omit<Achievement, "unlocked" | "unlockedAt">[] = [
  { id: "first_blood", name: "Primera Cacería", description: "Completá tu primer entrenamiento.", icon: "⚔️" },
  { id: "week_warrior", name: "Guerrero Semanal", description: "Completá 4 entrenamientos en una semana.", icon: "🛡️" },
  { id: "pr_machine", name: "Rompe-PRs", description: "Registrá tu primer PR técnico.", icon: "🏆" },
  { id: "mobility_monk", name: "Monje de la Movilidad", description: "5 sesiones de movilidad.", icon: "🧘" },
  { id: "protein_disciple", name: "Discípulo de la Proteína", description: "Cumplí tu proteína 5 días.", icon: "🥩" },
  { id: "leg_survivor", name: "Sobreviviente del Leg Day", description: "Completá 5 sesiones de pierna.", icon: "🦵" },
  { id: "iron_streak", name: "Racha de Hierro", description: "Racha de 7 entrenamientos.", icon: "🔥" },
  { id: "boss_slayer", name: "Cazador de Jefes", description: "Derrotá un Boss semanal.", icon: "👹" },
];

// Stats iniciales.
export const INITIAL_STATS: RPGStats = {
  strength: 10,
  hypertrophy: 10,
  endurance: 8,
  mobility: 5,
  discipline: 8,
  core: 6,
  upperBody: 10,
  lowerBody: 10,
  recovery: 8,
};

// Mapa de grupo muscular -> qué stats sube.
export const MUSCLE_STAT_MAP: Record<MuscleGroup, (keyof RPGStats)[]> = {
  pecho: ["upperBody", "hypertrophy"],
  pecho_superior: ["upperBody", "hypertrophy"],
  espalda: ["upperBody", "strength"],
  dorsal: ["upperBody", "hypertrophy"],
  trapecio: ["upperBody"],
  hombro_lateral: ["upperBody", "hypertrophy"],
  hombro_posterior: ["upperBody"],
  hombro_frontal: ["upperBody"],
  biceps: ["upperBody"],
  triceps: ["upperBody"],
  cuadriceps: ["lowerBody", "strength"],
  femoral: ["lowerBody", "strength"],
  gluteo: ["lowerBody", "hypertrophy"],
  aductor: ["lowerBody"],
  abductor: ["lowerBody"],
  gemelo: ["lowerBody"],
  core: ["core", "endurance"],
  movilidad: ["mobility", "recovery"],
};
