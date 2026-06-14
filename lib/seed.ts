import type { AppState, RPGProfile } from "@/lib/types";
import { EXERCISES } from "@/lib/data/exercises";
import { TEMPLATES } from "@/lib/data/templates";
import { PROGRESSION_RULES } from "@/lib/data/progressionRules";
import { MOBILITY_ROUTINES } from "@/lib/data/mobility";
import { ACHIEVEMENTS, TITLES, INITIAL_STATS } from "@/lib/data/rpg";
import { planForDays } from "@/lib/scheduler";
import { weekStart } from "@/lib/utils";

export const STATE_VERSION = 1;

export function initialRPG(): RPGProfile {
  return {
    level: 1,
    xp: 0,
    xpThisWeek: 0,
    rank: "E",
    titles: TITLES.map((t) => ({ ...t, unlocked: false })),
    activeTitle: undefined,
    stats: { ...INITIAL_STATS },
    achievements: ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })),
    streaks: { workout: 0, protein: 0, mobility: 0 },
  };
}

export function createInitialState(): AppState {
  return {
    version: STATE_VERSION,
    profile: {
      name: "Manuel Cosovschi",
      age: 26,
      height: 186,
      weight: 83,
      proteinTarget: 180,
      goals: [
        "Forma V",
        "Hombros 3D",
        "Pecho superior formado",
        "Espalda ancha y dorsales visibles",
        "Trapecios notorios",
        "Brazos grandes",
        "Piernas y glúteos muy desarrollados",
        "Core con frecuencia",
        "Mejor movilidad (cadera, lumbar, cuello)",
      ],
      injuriesOrNotes:
        "Entrenamiento últimamente irregular. Nivel avanzado. Cuidar lumbar y rodillas. Polea de jalón con placas que se pegan.",
    },
    exercises: EXERCISES,
    templates: TEMPLATES,
    progressionRules: PROGRESSION_RULES,
    workoutLogs: [],
    rpg: initialRPG(),
    nutritionLogs: [],
    mobilityLogs: [],
    mobilityRoutines: MOBILITY_ROUTINES,
    measurements: [],
    weekPlan: {
      weekStart: weekStart(),
      daysAvailable: 5,
      templateIds: planForDays(5),
    },
    todayIndex: 0,
    weightOverrides: {},
    lastSuggestions: {},
  };
}
