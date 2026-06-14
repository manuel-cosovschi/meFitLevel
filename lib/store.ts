"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AppState,
  UserProfile,
  WorkoutLog,
  ExerciseLog,
  SymptomKey,
  MealEntry,
  BodyMeasurement,
  ProgressionSuggestion,
  WorkoutTemplate,
  SessionFocus,
  MuscleGroup,
} from "@/lib/types";
import { createInitialState, STATE_VERSION } from "@/lib/seed";
import { exerciseById } from "@/lib/data/exercises";
import {
  analyzeExercise,
  detectPR,
  sessionWorkingWeight,
} from "@/lib/progression";
import {
  gainsFromWorkout,
  applyWorkoutToRPG,
  maybeResetWeekly,
  type WorkoutRPGResult,
} from "@/lib/rpg";
import { planForDays } from "@/lib/scheduler";
import { uid, todayKey, weekStart } from "@/lib/utils";

export interface SaveWorkoutInput {
  templateId: string;
  templateName: string;
  focus: SessionFocus;
  muscleGroups: MuscleGroup[];
  duration: number;
  exercisesLogged: ExerciseLog[];
  symptoms: SymptomKey[];
  notes?: string;
}

export interface SaveWorkoutResult extends WorkoutRPGResult {
  workout: WorkoutLog;
  suggestions: ProgressionSuggestion[];
  prs: string[];
}

interface StoreActions {
  hydrated: boolean;
  setHydrated: () => void;
  refreshWeek: () => void;
  setProfile: (p: Partial<UserProfile>) => void;
  setWeekDays: (days: number) => void;
  setTodayIndex: (i: number) => void;
  saveWorkout: (input: SaveWorkoutInput) => SaveWorkoutResult;
  addMeal: (meal: Omit<MealEntry, "id">) => void;
  removeMeal: (id: string) => void;
  setProteinTarget: (g: number) => void;
  completeMobility: (routineId: string, duration: number) => void;
  addMeasurement: (m: Omit<BodyMeasurement, "id" | "date"> & { date?: string }) => void;
  setActiveTitle: (id: string | undefined) => void;
  duplicateTemplate: (id: string) => void;
  updateTemplate: (t: WorkoutTemplate) => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAll: () => void;
}

export type Store = AppState & StoreActions;

const workingWeightFor = (state: AppState, exerciseId: string): number => {
  if (state.weightOverrides[exerciseId] != null) return state.weightOverrides[exerciseId];
  for (const t of state.templates) {
    const we = t.exercises.find((e) => e.exerciseId === exerciseId);
    if (we) return we.suggestedWeight;
  }
  return 0;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      refreshWeek: () => {
        const state = get();
        const ws = weekStart();
        // Reset de XP semanal si cambió la semana.
        const { rpg } = maybeResetWeekly(state.rpg, state.weekPlan.weekStart);
        if (state.weekPlan.weekStart !== ws) {
          set({
            rpg,
            weekPlan: {
              weekStart: ws,
              daysAvailable: state.weekPlan.daysAvailable,
              templateIds: planForDays(state.weekPlan.daysAvailable),
            },
            todayIndex: 0,
          });
        }
      },

      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),

      setWeekDays: (days) =>
        set((s) => ({
          weekPlan: {
            ...s.weekPlan,
            daysAvailable: days,
            templateIds: planForDays(days),
          },
          todayIndex: 0,
        })),

      setTodayIndex: (i) => set({ todayIndex: i }),

      saveWorkout: (input) => {
        const state = get();

        // Volumen y series efectivas.
        let totalVolume = 0;
        let effectiveSets = 0;
        let totalPrescribed = 0;
        let totalCompleted = 0;
        for (const el of input.exercisesLogged) {
          for (const st of el.sets) {
            totalPrescribed++;
            if (st.completed) {
              totalCompleted++;
              totalVolume += st.actualWeight * st.actualReps;
              if (st.kind !== "calentamiento") effectiveSets++;
            }
          }
        }

        // PRs + sugerencias de progresión.
        const prs: string[] = [];
        const suggestions: ProgressionSuggestion[] = [];
        const overrides = { ...state.weightOverrides };
        const lastSuggestions = { ...state.lastSuggestions };
        let progressed = false;

        for (const el of input.exercisesLogged) {
          const targetId = el.swapped && el.swappedFor ? el.swappedFor : el.exerciseId;
          const prevW = workingWeightFor(state, targetId) || sessionWorkingWeight(el);
          const pr = detectPR({ ...el, exerciseId: targetId }, state.workoutLogs);
          if (pr.isPR) {
            const name = exerciseById(targetId)?.name ?? targetId;
            prs.push(`${name}: ${pr.description}`);
          }
          const sug = analyzeExercise({ ...el, exerciseId: targetId }, prevW);
          suggestions.push(sug);
          lastSuggestions[targetId] = sug;
          overrides[targetId] = sug.newWeight;
          if (sug.action === "subir") progressed = true;
        }

        const today = todayKey();
        const nut = state.nutritionLogs.find((n) => n.date === today);
        const proteinHit = !!nut && nut.proteinConsumed >= nut.proteinTarget;
        const mobilityDone = state.mobilityLogs.some((m) => m.date === today && m.completed);
        const allSets = totalPrescribed > 0 && totalCompleted === totalPrescribed;

        const workout: WorkoutLog = {
          id: uid(),
          date: new Date().toISOString(),
          templateId: input.templateId,
          templateName: input.templateName,
          focus: input.focus,
          duration: input.duration,
          exercisesLogged: input.exercisesLogged,
          totalVolume: Math.round(totalVolume),
          effectiveSets,
          xpEarned: 0,
          prs,
          symptoms: input.symptoms,
          notes: input.notes,
          muscleGroups: input.muscleGroups,
        };

        const gains = gainsFromWorkout(workout, {
          proteinHit,
          mobilityDone,
          progressed,
          allSets,
        });
        workout.xpEarned = gains.xp;

        const ws = weekStart();
        const allLogs = [...state.workoutLogs, workout];
        const weekWorkouts = allLogs.filter((w) => weekStart(new Date(w.date)) === ws);
        const legSessions = allLogs.filter(
          (w) => w.focus === "lower_a" || w.focus === "lower_b",
        ).length;

        const rpgRes = applyWorkoutToRPG(state.rpg, workout, gains, {
          weeklyWorkouts: weekWorkouts.length,
          legSessions,
        });

        const nextIndex =
          state.weekPlan.templateIds.length > 0
            ? (state.todayIndex + 1) % state.weekPlan.templateIds.length
            : 0;

        set({
          workoutLogs: allLogs,
          rpg: rpgRes.rpg,
          weightOverrides: overrides,
          lastSuggestions,
          todayIndex: nextIndex,
        });

        return { ...rpgRes, workout, suggestions, prs };
      },

      addMeal: (meal) =>
        set((s) => {
          const today = todayKey();
          const logs = [...s.nutritionLogs];
          let log = logs.find((n) => n.date === today);
          const entry: MealEntry = { ...meal, id: uid() };
          if (!log) {
            log = { date: today, proteinTarget: s.profile.proteinTarget, proteinConsumed: 0, meals: [] };
            logs.push(log);
          }
          log.meals = [...log.meals, entry];
          log.proteinConsumed = log.meals.reduce((a, m) => a + m.protein, 0);
          log.proteinTarget = s.profile.proteinTarget;
          return { nutritionLogs: logs };
        }),

      removeMeal: (id) =>
        set((s) => {
          const today = todayKey();
          const logs = s.nutritionLogs.map((n) => {
            if (n.date !== today) return n;
            const meals = n.meals.filter((m) => m.id !== id);
            return { ...n, meals, proteinConsumed: meals.reduce((a, m) => a + m.protein, 0) };
          });
          return { nutritionLogs: logs };
        }),

      setProteinTarget: (g) =>
        set((s) => ({ profile: { ...s.profile, proteinTarget: g } })),

      completeMobility: (routineId, duration) =>
        set((s) => {
          const today = todayKey();
          const exists = s.mobilityLogs.find((m) => m.date === today && m.routineId === routineId);
          if (exists) return {};
          const streaks = { ...s.rpg.streaks };
          streaks.mobility = (streaks.mobility ?? 0) + 1;
          streaks.lastMobilityDate = today;
          return {
            mobilityLogs: [...s.mobilityLogs, { date: today, routineId, completed: true, duration }],
            rpg: { ...s.rpg, streaks, xp: s.rpg.xp + 15, xpThisWeek: s.rpg.xpThisWeek + 15 },
          };
        }),

      addMeasurement: (m) =>
        set((s) => ({
          measurements: [
            { ...m, id: uid(), date: m.date ?? todayKey() },
            ...s.measurements,
          ],
        })),

      setActiveTitle: (id) => set((s) => ({ rpg: { ...s.rpg, activeTitle: id } })),

      duplicateTemplate: (id) =>
        set((s) => {
          const t = s.templates.find((x) => x.id === id);
          if (!t) return {};
          const copy: WorkoutTemplate = {
            ...t,
            id: `${t.id}_${uid()}`,
            name: `${t.name} (copia)`,
            focus: "custom",
            exercises: t.exercises.map((e) => ({ ...e, sets: e.sets.map((x) => ({ ...x })) })),
          };
          return { templates: [...s.templates, copy] };
        }),

      updateTemplate: (t) =>
        set((s) => ({ templates: s.templates.map((x) => (x.id === t.id ? t : x)) })),

      exportData: () => {
        const s = get();
        const { hydrated, ...data } = s as Store;
        return JSON.stringify(data, null, 2);
      },

      importData: (json) => {
        try {
          const parsed = JSON.parse(json) as AppState;
          if (!parsed.version) return false;
          set({ ...parsed });
          return true;
        } catch {
          return false;
        }
      },

      resetAll: () => set({ ...createInitialState() }),
    }),
    {
      name: "hunter-gym-system",
      version: STATE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        const { hydrated, setHydrated, ...rest } = s as Store;
        return rest as unknown as Store;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
        state?.refreshWeek();
      },
    },
  ),
);
