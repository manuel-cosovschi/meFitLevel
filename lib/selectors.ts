import type {
  AppState,
  WorkoutTemplate,
  WorkoutExercise,
  Exercise,
  PrescribedSet,
  ProgressionSuggestion,
  MuscleGroup,
} from "@/lib/types";
import { exerciseById } from "@/lib/data/exercises";
import { buildSessionSets, needsDeload } from "@/lib/progression";
import { weekStart } from "@/lib/utils";

export interface SessionExercise {
  we: WorkoutExercise;
  exercise: Exercise | undefined;
  workingWeight: number;
  sets: PrescribedSet[];
  suggestion?: ProgressionSuggestion;
  deload: boolean;
}

export interface TodaySession {
  template: WorkoutTemplate | undefined;
  index: number;
  totalDays: number;
  exercises: SessionExercise[];
  potentialXp: number;
}

export function getTemplate(state: AppState, id: string): WorkoutTemplate | undefined {
  return state.templates.find((t) => t.id === id);
}

export function getTodayTemplateId(state: AppState): string | undefined {
  return state.weekPlan.templateIds[state.todayIndex];
}

function workingWeightFor(state: AppState, exerciseId: string, fallback: number): number {
  return state.weightOverrides[exerciseId] ?? fallback;
}

export function buildSession(state: AppState, templateId: string): TodaySession {
  const template = getTemplate(state, templateId);
  const exercises: SessionExercise[] = [];
  let potentialXp = 0;
  if (template) {
    for (const we of template.exercises) {
      const exercise = exerciseById(we.exerciseId);
      const workingWeight = workingWeightFor(state, we.exerciseId, we.suggestedWeight);
      const sets = buildSessionSets(we, workingWeight);
      exercises.push({
        we,
        exercise,
        workingWeight,
        sets,
        suggestion: state.lastSuggestions[we.exerciseId],
        deload: needsDeload(we.exerciseId, state.workoutLogs),
      });
      potentialXp += sets.length * 3;
    }
  }
  // XP base aproximada por completar la sesión.
  potentialXp += 50 + 10 + 25 + 30;
  return {
    template,
    index: state.todayIndex,
    totalDays: state.weekPlan.templateIds.length,
    exercises,
    potentialXp,
  };
}

export function getTodaySession(state: AppState): TodaySession {
  const id = getTodayTemplateId(state);
  if (!id) {
    return { template: undefined, index: 0, totalDays: 0, exercises: [], potentialXp: 0 };
  }
  return buildSession(state, id);
}

// Grupos musculares entrenados vs pendientes en la semana actual.
export function weeklyMuscleStatus(state: AppState): {
  trained: MuscleGroup[];
  pending: MuscleGroup[];
} {
  const ws = weekStart();
  const trained = new Set<MuscleGroup>();
  state.workoutLogs
    .filter((w) => weekStart(new Date(w.date)) === ws)
    .forEach((w) => w.muscleGroups.forEach((m) => trained.add(m)));

  const planned = new Set<MuscleGroup>();
  state.weekPlan.templateIds.forEach((tid) => {
    getTemplate(state, tid)?.muscleGroups.forEach((m) => planned.add(m));
  });

  const pending = [...planned].filter((m) => !trained.has(m));
  return { trained: [...trained], pending };
}

export function workoutsThisWeek(state: AppState): number {
  const ws = weekStart();
  return state.workoutLogs.filter((w) => weekStart(new Date(w.date)) === ws).length;
}
