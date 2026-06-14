import type {
  AppState,
  RPGProfile,
  WorkoutLog,
  Mission,
  Achievement,
  RPGStats,
  MuscleGroup,
} from "@/lib/types";
import {
  XP,
  levelFromXp,
  rankFromLevel,
  MUSCLE_STAT_MAP,
  TITLES,
} from "@/lib/data/rpg";
import { todayKey, weekStart, daysBetween } from "@/lib/utils";

// =============================================================
// Lógica del sistema RPG: XP, niveles, stats, streaks, misiones,
// logros, títulos.
// =============================================================

export interface WorkoutRPGResult {
  rpg: RPGProfile;
  xpEarned: number;
  leveledUp: boolean;
  fromLevel: number;
  toLevel: number;
  newAchievements: Achievement[];
  newTitles: string[];
}

// XP + stats que aporta un entrenamiento concreto.
export function gainsFromWorkout(
  wl: WorkoutLog,
  opts: { proteinHit: boolean; mobilityDone: boolean; progressed: boolean; allSets: boolean },
): { xp: number; stats: Partial<RPGStats> } {
  let xp = XP.completeWorkout;
  if (opts.allSets) xp += XP.logAllSets;
  if (opts.proteinHit) xp += XP.proteinHit;
  if (opts.mobilityDone) xp += XP.mobility;
  if (wl.muscleGroups.includes("core")) xp += XP.abs;
  if (opts.progressed) xp += XP.progressExercise;
  if (wl.prs.length > 0) xp += XP.newPr;

  // Stats: cada grupo trabajado suma a sus stats asociados.
  const stats: Partial<RPGStats> = {};
  const bump = (k: keyof RPGStats, v: number) => {
    stats[k] = (stats[k] ?? 0) + v;
  };
  const groups = new Set<MuscleGroup>(wl.muscleGroups);
  groups.forEach((g) => {
    (MUSCLE_STAT_MAP[g] || []).forEach((stat) => bump(stat, 1));
  });
  bump("discipline", 1);
  if (wl.effectiveSets >= 15) bump("endurance", 1);
  return { xp, stats };
}

function addStats(base: RPGStats, delta: Partial<RPGStats>): RPGStats {
  const out = { ...base };
  (Object.keys(delta) as (keyof RPGStats)[]).forEach((k) => {
    out[k] = (out[k] ?? 0) + (delta[k] ?? 0);
  });
  return out;
}

// Aplica un entrenamiento al perfil RPG y devuelve el nuevo estado + eventos.
export function applyWorkoutToRPG(
  rpg: RPGProfile,
  wl: WorkoutLog,
  gains: { xp: number; stats: Partial<RPGStats> },
  context: { weeklyWorkouts: number; legSessions: number },
): WorkoutRPGResult {
  const fromInfo = levelFromXp(rpg.xp);
  const newXp = rpg.xp + gains.xp;
  const toInfo = levelFromXp(newXp);
  const stats = addStats(rpg.stats, gains.stats);

  // Streak de entrenamiento.
  const today = todayKey();
  const streaks = { ...rpg.streaks };
  if (streaks.lastWorkoutDate) {
    const gap = daysBetween(streaks.lastWorkoutDate, today);
    if (gap === 0) {
      /* mismo día, no cambia */
    } else if (gap <= 2) {
      streaks.workout += 1;
    } else {
      streaks.workout = 1;
    }
  } else {
    streaks.workout = 1;
  }
  streaks.lastWorkoutDate = today;

  // Logros.
  const achievements = rpg.achievements.map((a) => ({ ...a }));
  const newAchievements: Achievement[] = [];
  const unlock = (id: string) => {
    const a = achievements.find((x) => x.id === id);
    if (a && !a.unlocked) {
      a.unlocked = true;
      a.unlockedAt = new Date().toISOString();
      newAchievements.push(a);
    }
  };
  unlock("first_blood");
  if (context.weeklyWorkouts >= 4) unlock("week_warrior");
  if (wl.prs.length > 0) unlock("pr_machine");
  if (context.legSessions >= 5) unlock("leg_survivor");
  if (streaks.workout >= 7) unlock("iron_streak");

  // Títulos.
  const titles = rpg.titles.map((t) => ({ ...t }));
  const newTitles: string[] = [];
  const unlockTitle = (id: string) => {
    const t = titles.find((x) => x.id === id);
    if (t && !t.unlocked) {
      t.unlocked = true;
      newTitles.push(t.name);
    }
  };
  if (toInfo.level >= 3) unlockTitle("v_taper");
  if (stats.upperBody >= 25) unlockTitle("dorsal_hunter");
  if (stats.lowerBody >= 25) unlockTitle("glute_builder");
  if (streaks.workout >= 5) unlockTitle("iron_discipline");
  if (context.legSessions >= 5) unlockTitle("leg_day_survivor");
  if (toInfo.level >= 20) unlockTitle("shadow_monarch");

  const rank = rankFromLevel(toInfo.level).rank;

  return {
    rpg: {
      ...rpg,
      xp: newXp,
      xpThisWeek: rpg.xpThisWeek + gains.xp,
      level: toInfo.level,
      rank,
      stats,
      streaks,
      achievements,
      titles,
    },
    xpEarned: gains.xp,
    leveledUp: toInfo.level > fromInfo.level,
    fromLevel: fromInfo.level,
    toLevel: toInfo.level,
    newAchievements,
    newTitles,
  };
}

// ---- Misiones (calculadas a partir del estado) ----
export function computeMissions(state: AppState): {
  daily: Mission[];
  weekly: Mission[];
  boss: Mission;
} {
  const today = todayKey();
  const ws = weekStart();
  const todaysWorkouts = state.workoutLogs.filter((w) => w.date.slice(0, 10) === today);
  const weekWorkouts = state.workoutLogs.filter((w) => weekStart(new Date(w.date)) === ws);
  const nutToday = state.nutritionLogs.find((n) => n.date === today);
  const mobToday = state.mobilityLogs.find((m) => m.date === today && m.completed);
  const proteinHit = !!nutToday && nutToday.proteinConsumed >= nutToday.proteinTarget;

  const daily: Mission[] = [
    {
      id: "d_workout",
      type: "diaria",
      name: "Completar el entrenamiento de hoy",
      description: "Registrá y guardá tu sesión.",
      xp: XP.completeWorkout,
      done: todaysWorkouts.length > 0,
    },
    {
      id: "d_protein",
      type: "diaria",
      name: `Cumplir proteína (${state.profile.proteinTarget} g)`,
      description: "Llegá a tu objetivo diario de proteína.",
      xp: XP.proteinHit,
      done: proteinHit,
      progress: nutToday?.proteinConsumed ?? 0,
      goal: state.profile.proteinTarget,
    },
    {
      id: "d_mobility",
      type: "diaria",
      name: "Hacer movilidad",
      description: "Completá una rutina de movilidad.",
      xp: XP.mobility,
      done: !!mobToday,
    },
  ];

  const legSessionsWeek = weekWorkouts.filter((w) => w.focus === "lower_a" || w.focus === "lower_b").length;
  const weekly: Mission[] = [
    {
      id: "w_four",
      type: "semanal",
      name: "Completar 4 entrenamientos",
      description: "Mantené la frecuencia semanal.",
      xp: XP.fourWorkouts,
      done: weekWorkouts.length >= 4,
      progress: weekWorkouts.length,
      goal: 4,
    },
    {
      id: "w_legs",
      type: "semanal",
      name: "2 sesiones de pierna/glúteo",
      description: "Priorizá tren inferior.",
      xp: 80,
      done: legSessionsWeek >= 2,
      progress: legSessionsWeek,
      goal: 2,
    },
    {
      id: "w_mobility",
      type: "semanal",
      name: "3 sesiones de movilidad",
      description: "Mejorá cadera, lumbar y cuello.",
      xp: 60,
      done: state.mobilityLogs.filter((m) => weekStart(new Date(m.date)) === ws && m.completed).length >= 3,
      progress: state.mobilityLogs.filter((m) => weekStart(new Date(m.date)) === ws && m.completed).length,
      goal: 3,
    },
  ];

  const boss: Mission = {
    id: "boss_irregular",
    type: "boss",
    name: "Boss: Derrotar la Semana Irregular",
    description: "Completá al menos 3 entrenamientos esta semana para vencer al jefe.",
    xp: 150,
    done: weekWorkouts.length >= 3,
    progress: weekWorkouts.length,
    goal: 3,
  };

  return { daily, weekly, boss };
}

// Resetea XP semanal si cambió la semana. Devuelve rpg posiblemente actualizado.
export function maybeResetWeekly(rpg: RPGProfile, lastWeek: string | undefined): {
  rpg: RPGProfile;
  week: string;
} {
  const ws = weekStart();
  if (lastWeek !== ws) {
    return { rpg: { ...rpg, xpThisWeek: 0 }, week: ws };
  }
  return { rpg, week: ws };
}

export { TITLES };
